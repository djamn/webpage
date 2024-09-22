import {Component, OnInit} from '@angular/core';
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Snackbar} from "../../../utility/snackbar";
import {isControlInvalid} from "../../../utility/form-utils";
import {GuestbookService} from "../../../services/guestbook.service";

@Component({
  selector: 'guestbook-create-entry-component',
  templateUrl: './guestbook-create-entry.component.html',
  styleUrl: './guestbook-create-entry.component.css'
})
export class GuestbookCreateEntryComponent implements OnInit {
  createEntryForm!: UntypedFormGroup;
  config: any;
  entryId: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private translate: TranslateService,
    private snackbar: Snackbar,
    private route: ActivatedRoute,
    private guestbookService: GuestbookService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();

    this.createEntryForm = new UntypedFormGroup({
      username: new UntypedFormControl({value: '', disabled: !this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE}, [
        Validators.required,
        Validators.maxLength(this.config.GUESTBOOK_USERNAME_MAX_LENGTH),
        Validators.pattern(this.config.GUESTBOOK_USERNAME_CHARACTER_PATTERN)
      ]),
      entry_message: new UntypedFormControl({value: '', disabled: !this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE}, [
        Validators.required,
      ]),
      recaptcha: new UntypedFormControl({value: '', disabled: !this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE}, [
        Validators.required,
      ]),
      confirmation_checkbox: new UntypedFormControl({
        value: '',
        disabled: !this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE
      }, [
        Validators.requiredTrue,
      ])
    })

    // TODO handle permission
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
  }

  // TODO rework
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
  };

  async createEntry() {
    if (!this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE && !this.isEditMode) {
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.NO_CREATION_POSSIBLE_HINT'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    // Show field is required hint
    if (this.createEntryForm.invalid) {
      this.createEntryForm.markAllAsTouched();
/*      Object.keys(this.createEntryForm.controls).forEach(field => {
        const control = this.createEntryForm.get(field);
        if (control) {
          control.markAsTouched({onlySelf: true});
        }
      });*/
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.FIELDS_HAVE_ERRORS'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    try {
      const formEntry = this.createEntryForm.value;
      const trimmedUsername = formEntry.username.trim();

      if (this.isEditMode) {
        await this.guestbookService.updateEntry(this.entryId!, trimmedUsername, 'TITLE', Date.now(), false, formEntry.entry_message);
        this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ENTRY_UPDATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      } else {
        await this.guestbookService.addEntry(trimmedUsername, Date.now(), 'TITLE', true, formEntry.entry_message);
        this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ENTRY_CREATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      }

      this.createEntryForm.reset();
      await this.router.navigate(['../'], {relativeTo: this.route});


    } catch (e) {
      console.error("Guestbook entry creation error:", e);
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  async abort(event: MouseEvent) {
    event.stopPropagation();
    this.createEntryForm.reset();
    await this.router.navigate(['../'], {relativeTo: this.route});
  }

  protected readonly isControlInvalid = isControlInvalid;
}
