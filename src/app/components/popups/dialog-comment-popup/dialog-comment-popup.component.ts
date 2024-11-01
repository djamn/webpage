import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'dialog-comment-popup-component',
  templateUrl: './dialog-comment-popup.component.html',
  styleUrl: './dialog-comment-popup.component.css'
})
export class DialogCommentPopupComponent {
  commentForm!: UntypedFormGroup;

  constructor(public dialogRef: MatDialogRef<DialogCommentPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.commentForm = new UntypedFormGroup({
      comment: new UntypedFormControl('', [Validators.required])
    })
  }

  confirm() {
    // Show field is required hint
    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.commentForm.value.comment);
    this.commentForm.reset();
  }

  cancel() {
    this.commentForm.reset();
    this.dialogRef.close(false);
  }

  protected readonly isControlInvalid = isControlInvalid;
}
