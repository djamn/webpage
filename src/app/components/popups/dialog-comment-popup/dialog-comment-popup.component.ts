import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'dialog-comment-popup-component',
  templateUrl: './dialog-comment-popup.component.html',
  styleUrl: './dialog-comment-popup.component.css'
})
export class DialogCommentPopupComponent {
  @Input()
  dialogPopupDescription: string = '{0}' // TODO
  commentForm!: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<DialogCommentPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.commentForm = new UntypedFormGroup({
      comment: new UntypedFormControl('', [Validators.required])
    })

    this.setDescription();
  }

  confirm() {
    // Show field is required hint
    console.log(this.commentForm)
    if (this.commentForm.invalid) {
      Object.keys(this.commentForm.controls).forEach(field => {
        const control = this.commentForm.get(field);
        if (control) control.markAsTouched({onlySelf: true});
      });
      return;
    }

    this.dialogRef.close(true); // TODO
    this.commentForm.reset();
  }

  cancel() {
    this.commentForm.reset();
    this.dialogRef.close(false);
  }

  setDescription() {
    this.dialogPopupDescription = this.data.description;
  }

  protected readonly isControlInvalid = isControlInvalid;
}
