import {Component, Inject} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {isControlInvalid} from "../../../utility/form-utils";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfigService} from "../../../services/config.service";
import {GuestbookService} from "../../../services/guestbook.service";
import {Snackbar} from "../../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-create-project-popup',
  templateUrl: './project-popup.component.html',
  styleUrl: './project-popup.component.css'
})
export class ProjectPopupComponent {
  config: any;
  projectForm!: UntypedFormGroup;
  projectId: string | null = null;
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

  constructor(public dialogRef: MatDialogRef<ProjectPopupComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any,
              private configService: ConfigService,
              private guestbookService: GuestbookService,
              private snackbar: Snackbar,
              private translate: TranslateService) {
    this.config = this.configService.getConfig();

    this.projectForm = new UntypedFormGroup({
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
      silent_edit: new UntypedFormControl(false)
    })

    if (data) {
      const entry = data;
      this.isEditMode = true;
      this.projectId = entry.id;
      this.projectForm.patchValue({
        title: entry.title,
        username: entry.username,
        entry_message: entry.entry_message,
      })
      this.projectForm.get('recaptcha')?.disable();
      this.projectForm.get('confirmation_checkbox')?.disable();
    }
  }

  async confirm() {
    if (!this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE && !this.isEditMode) return;

    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.FIELDS_HAVE_ERRORS'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    const formEntry = this.projectForm.value;
    const trimmedUsername = formEntry.username.trim();

    try {
      if (this.isEditMode) {
        await this.guestbookService.updateEntry(this.projectId!, trimmedUsername, formEntry.title, Date.now(), formEntry.silent_edit, formEntry.entry_message);
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
