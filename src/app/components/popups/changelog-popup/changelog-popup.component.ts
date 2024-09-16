import {Component, Inject} from '@angular/core';
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogPopupComponent} from "../dialog-popup/dialog-popup.component";

@Component({
  selector: 'app-changelog-popup',
  templateUrl: './changelog-popup.component.html',
  styleUrl: './changelog-popup.component.css'
})
export class ChangelogPopupComponent {
  config: any;
  changelogForm!: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private configService: ConfigService) {
    this.config = this.configService.getConfig();
    const timeString = new Date().toLocaleTimeString('de-AT', {hour: '2-digit', minute: '2-digit'});

    if (!data) {
      this.changelogForm = new UntypedFormGroup({
        changes: new UntypedFormControl('', [Validators.required]),
        version: new UntypedFormControl('', [Validators.required]),
        version_category: new UntypedFormControl(this.config.VERSION_CATEGORIES[0]),
        date: new UntypedFormControl(new Date().toISOString().substring(0, 10)),
        time: new UntypedFormControl(timeString),
      })} else {


        this.changelogForm = new UntypedFormGroup({
          changes: new UntypedFormControl(data.changes, [Validators.required]),
          version: new UntypedFormControl(data.version, [Validators.required]),
          version_category: new UntypedFormControl(data.version_category),
          date: new UntypedFormControl(''),
          time: new UntypedFormControl(''),
      })
    }
  }

  confirm() {
    if (this.changelogForm.invalid) {
      console.debug('Invalid form')
      this.changelogForm.markAllAsTouched();
      return;
    }

    const changesText = this.changelogForm.get('changes')?.value || '';
    const changesArray = changesText.split('\n').filter((line: string) => line.trim() !== '');

    const timestamp = this.getFormTimeStamp();
    const version = this.changelogForm.get('version')?.value
    const versionCategory = this.changelogForm.get('version_category')?.value

    this.dialogRef.close({timestamp, version, versionCategory, changesArray});
  }

  /*    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    const day = String(dateObject.getDate()).padStart(2, '0');

    // Extract the hours and minutes
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');
    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;

    // Format the time as HH:MM
    const formattedTime = `${hours}:${minutes}`;
    console.log("Date:", formattedDate);
    console.log("Time:", formattedTime);*/

  // TODO UTILITY
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}. ${month}. ${year}`;
  }

  // TODO UTILITY
  getFormTimeStamp() {
    const date = this.changelogForm.get('date')?.value;
    const time = this.changelogForm.get('time')?.value;

    const combinedDateTime = date + 'T' + time;
    const dateObject = new Date(combinedDateTime);
    return dateObject.getTime();
  }

  cancel() {
    // this.dialogRef.close(false);
  }

  setDescription() {
    // this.dialogPopupDescription = this.data.description;
    // this.buttonActionText = this.data.button_action_text
  }

  protected readonly isControlInvalid = isControlInvalid;
}
