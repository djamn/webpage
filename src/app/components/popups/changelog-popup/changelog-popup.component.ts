import {Component} from '@angular/core';
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'app-changelog-popup',
  templateUrl: './changelog-popup.component.html',
  styleUrl: './changelog-popup.component.css'
})
export class ChangelogPopupComponent {
  dialogPopupDescription: string = ''
  buttonActionText: string = ''
  config: any;
  changelogForm!: UntypedFormGroup;

  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
    this.changelogForm = new UntypedFormGroup({
      changes: new UntypedFormControl('', [Validators.required]),
      version: new UntypedFormControl('', [Validators.required]),
      version_category: new UntypedFormControl(this.config.VERSION_CATEGORIES[0]),
      date: new UntypedFormControl(''),
      time: new UntypedFormControl(''),
    })


  }

  // constructor(public dialogRef: MatDialogRef<DialogPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  //   this.setDescription();
  // }

  confirm() {
    if (this.changelogForm.invalid) {
      console.debug('Invalid form')
      this.changelogForm.markAllAsTouched();
      return;
    }

    console.log(this.changelogForm.get('date')?.value)
    console.log(this.changelogForm.get('time')?.value)
    console.log(this.changelogForm.get('version_category')?.value)

    const changesText = this.changelogForm.get('changes')?.value || '';
    const changesArray = changesText.split('\n').filter((line: string) => line.trim() !== '');

    const timestamp = this.getFormTimeStamp();
    const version = this.changelogForm.get('version')?.value
    const versionCategory = this.changelogForm.get('version_category')?.value


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


    console.log(changesArray)

    //
    this.changelogForm.reset();

    // this.dialogRef.close(true);
  }

  getFormTimeStamp() {
    const date = this.changelogForm.get('date')?.value || 0;
    const time = this.changelogForm.get('time')?.value || 0;

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
