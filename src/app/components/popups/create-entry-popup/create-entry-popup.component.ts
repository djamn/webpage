import {Component} from '@angular/core';
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'create-entry-popup',
  templateUrl: './create-entry-popup.component.html',
  styleUrl: './create-entry-popup.component.css'
})
export class CreateEntryPopupComponent {
  config: any;
  changelogForm!: UntypedFormGroup;
  createEntryForm!: UntypedFormGroup;
  isEditMode: boolean = false;

  quillModules = {
    toolbar: [
      [{'font': []}],
      ['bold', 'italic', 'underline'],
      ['code-block'],
      [{'list': 'ordered'}],
      [{'script': 'sub'}, {'script': 'super'}],
      [{'color': []}, {'background': []}],
      ['clean'],
      ['emoji']  // Add emoji to the toolbar
    ],
    'emoji-toolbar': false,
  }

  // public dialogRef: MatDialogRef<CreateEntryPopupComponent>,
  // public data: any
  //               @Inject(MAT_DIALOG_DATA)

  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();

    this.createEntryForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [
        Validators.required,
      ]),
      username: new UntypedFormControl('', [
        Validators.required,
        Validators.maxLength(this.config.GUESTBOOK_USERNAME_MAX_LENGTH),
        Validators.pattern(this.config.GUESTBOOK_USERNAME_CHARACTER_PATTERN)
      ]),
      entry_message: new UntypedFormControl('', [
        Validators.required,
      ]),
      recaptcha: new UntypedFormControl('', [
        Validators.required,
      ]),
      confirmation_checkbox: new UntypedFormControl('', [
        Validators.requiredTrue,
      ]),
      silent_edit: new UntypedFormControl()
    })

    // TODO updateEntry
    /*
        if (history.state && history.state.entry) {
      const entry = history.state.entry;
      this.entryId = entry.id;
      this.isEditMode = true;
      this.createEntryForm.get('recaptcha')?.disable();
      this.createEntryForm.get('confirmation_checkbox')?.disable();
      this.createEntryForm.patchValue({
        username: entry.username,
        entry_message: entry.entry_message,
      })
    }
     */

    const timeString = new Date().toLocaleTimeString('de-AT', {hour: '2-digit', minute: '2-digit'});

    /*    if (!data) {
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
        }*/
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

    /*    this.dialogRef.close({
          timestamp: timestamp,
          version: version,
          version_category: versionCategory,
          changes: changesArray
        });*/
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
    // this.dialogRef.close(false);
  }

  protected readonly isControlInvalid = isControlInvalid;
}
