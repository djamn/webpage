import {Component, Inject} from '@angular/core';
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogPopupComponent} from "../dialog-popup/dialog-popup.component";
import {CreateEntryPopupComponent} from "../create-entry-popup/create-entry-popup.component";

@Component({
  selector: 'app-changelog-popup',
  templateUrl: './changelog-popup.component.html',
  styleUrl: './changelog-popup.component.css'
})
export class ChangelogPopupComponent {
  config: any;
  changelogForm!: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<ChangelogPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private configService: ConfigService) {
    this.config = this.configService.getConfig();
    const timeString = new Date().toLocaleTimeString('de-AT', {hour: '2-digit', minute: '2-digit'});

    if (!data) {
      this.changelogForm = new UntypedFormGroup({
        changes: new UntypedFormControl('', [Validators.required]),
        version: new UntypedFormControl('', [Validators.required]),
        version_category: new UntypedFormControl(this.config.VERSION_CATEGORIES[0]),
        date: new UntypedFormControl(new Date().toISOString().substring(0, 10)),
        time: new UntypedFormControl(timeString),
      })
    } else {
      const dateObj = new Date(data.timestamp);
      // const dateString = dateObj.toLocaleDateString('de-AT', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const dateString = dateObj.toISOString().substring(0, 10)
      const timeString = dateObj.toLocaleTimeString('de-AT', {hour: '2-digit', minute: '2-digit'});

      this.changelogForm = new UntypedFormGroup({
        changes: new UntypedFormControl(data.changes.join('\n'), [Validators.required]),
        version: new UntypedFormControl(data.version, [Validators.required]),
        version_category: new UntypedFormControl(data.version_category),
        date: new UntypedFormControl(dateString),
        time: new UntypedFormControl(timeString),
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

    this.dialogRef.close({
      timestamp: timestamp,
      version: version,
      version_category: versionCategory,
      changes: changesArray
    });
  }

  getFormTimeStamp() {
    const date = this.changelogForm.get('date')?.value;
    const time = this.changelogForm.get('time')?.value;

    const combinedDateTime = date + 'T' + time;
    const dateObject = new Date(combinedDateTime);

    if (isNaN(dateObject.getTime())) return new Date().getTime();
    else return dateObject.getTime();

  }

  cancel() {
    this.dialogRef.close(false);
  }

  protected readonly isControlInvalid = isControlInvalid;
}
