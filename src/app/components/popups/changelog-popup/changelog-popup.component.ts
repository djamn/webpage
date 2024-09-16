import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogPopupComponent} from "../dialog-popup/dialog-popup.component";
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-changelog-popup',
  templateUrl: './changelog-popup.component.html',
  styleUrl: './changelog-popup.component.css'
})
export class ChangelogPopupComponent {
  dialogPopupDescription: string = ''
  buttonActionText: string = ''
  changelogForm!:UntypedFormGroup;

  constructor() {
    this.changelogForm = new UntypedFormGroup({
      changes: new UntypedFormControl('', [Validators.required]),
      version: new UntypedFormControl('', [Validators.required]),
      version_category: new UntypedFormControl('', [Validators.required]),
      date: new UntypedFormControl('', [Validators.required]),
      time: new UntypedFormControl('', [Validators.required]),
    })


  }

  // constructor(public dialogRef: MatDialogRef<DialogPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  //   this.setDescription();
  // }

  confirm() {
    // this.dialogRef.close(true);
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
