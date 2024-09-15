import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'button-save-cancel-component',
  templateUrl: 'button-yes-cancel.component.html',
  styleUrls: ['button-yes-cancel.component.css'],
})
export class ButtonSaveCancelComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor() {
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
