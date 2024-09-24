import {Component, Inject} from '@angular/core';
import {isControlInvalid} from "../../../utility/form-utils";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {GuestbookService} from "../../../services/guestbook.service";
import {Snackbar} from "../../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'create-entry-popup',
  templateUrl: './create-entry-popup.component.html',
  styleUrl: './create-entry-popup.component.css'
})
export class CreateEntryPopupComponent {
  config: any;
  changelogForm!: UntypedFormGroup;
  createEntryForm!: UntypedFormGroup;
  entryId: string | null = null;
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

  constructor(public dialogRef: MatDialogRef<CreateEntryPopupComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any,
              private configService: ConfigService,
              private guestbookService: GuestbookService,
              private snackbar: Snackbar,
              private translate: TranslateService) {
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
      recaptcha: new UntypedFormControl(),
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

  async confirm() {
    if (!this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE && !this.isEditMode) return;

    if (this.createEntryForm.invalid) {
      this.createEntryForm.markAllAsTouched();
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.FIELDS_HAVE_ERRORS'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    const formEntry = this.createEntryForm.value;
    const trimmedUsername = formEntry.username.trim();

    try {
      if (this.isEditMode) {
        await this.guestbookService.updateEntry(this.entryId!, trimmedUsername, formEntry.title, Date.now(), formEntry.silent_edit, formEntry.entry_message);
        this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ENTRY_UPDATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      } else {
        await this.guestbookService.addEntry(trimmedUsername, Date.now(), formEntry.title, true, formEntry.entry_message);
        this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ENTRY_CREATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      }
      this.dialogRef.close(true);

    } catch (e) {
      console.error("Guestbook entry creation error:", e);
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  cancel() {
    this.dialogRef.close(false);
  }

  protected readonly isControlInvalid = isControlInvalid;
}
