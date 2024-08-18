import {Component, Inject, Input} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'dialog-popup-component',
  templateUrl: './dialog-popup.component.html',
  styleUrl: './dialog-popup.component.css'
})
export class DialogPopupComponent {
  @Input()
  dialogPopupDescription: string = '{0}'

  constructor(public dialogRef: MatDialogRef<DialogPopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.setDescription();
  }

  confirm() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  setDescription() {
    this.dialogPopupDescription = this.data.description;
  }
}
