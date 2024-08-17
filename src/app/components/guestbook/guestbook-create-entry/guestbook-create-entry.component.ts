import {Component, OnInit} from '@angular/core';
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Snackbar} from "../../../utility/snackbar";
import {isControlInvalid} from "../../../utility/form-utils";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {GuestbookService} from "../../../services/guestbook.service";
import Quill from "quill";
// @ts-ignore
import * as Emoji from 'quill2-emoji'
Quill.register("modules/emoji", Emoji);

@Component({
  selector: 'guestbook-create-entry-component',
  templateUrl: './guestbook-create-entry.component.html',
  styleUrl: './guestbook-create-entry.component.css'
})
export class GuestbookCreateEntryComponent implements OnInit {
  createEntryForm!: UntypedFormGroup;
  config: any;

  constructor(
    private configService: ConfigService,
    private router: Router,
    private translate: TranslateService,
    private snackbar: Snackbar,
    private route : ActivatedRoute,
    private guestbookService: GuestbookService,
    private fb: FormBuilder) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();

    /*    this.createEntryForm = this.fb.group({
          username: [{value: '', disabled: !this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE}, Validators.required],
          entry_message: ['', Validators.required],
          recaptcha: ['', Validators.required] // reCAPTCHA form control
        });*/

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
      confirmation_checkbox: new UntypedFormControl({value: '', disabled: !this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE}, [
        Validators.requiredTrue,
      ])
    })
  }

  quillModules = {
    toolbar: [
      [{ 'font': [] }],
      ['bold', 'italic', 'underline'],
      ['code-block'],
      [{ 'list': 'ordered' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
      ['emoji']  // Add emoji to the toolbar
    ],
    'emoji-toolbar': true,
  };

  async createEntry() {
    if (!this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE) {
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.NO_CREATION_POSSIBLE_HINT'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    // Show field is required hint
    if (this.createEntryForm.invalid) {
      Object.keys(this.createEntryForm.controls).forEach(field => {
        const control = this.createEntryForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.FIELDS_HAVE_ERRORS'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    if(!this.createEntryForm.value.recaptcha) {
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.RECAPTCHA_EXPIRED'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }

    try {
      const entry = this.createEntryForm.value;
      await this.guestbookService.addEntry(entry.username.trim(), Date.now(), 'visible', true, entry.entry_message)
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ENTRY_CREATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      this.createEntryForm.reset();
      await this.router.navigate(['../'], { relativeTo: this.route });
    } catch (e) {
      console.error("Guestbook entry creation error:", e);
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  onCaptchaResolved(event: any) {

  }

  async abort(event: MouseEvent) {
    event.stopPropagation();
    this.createEntryForm.reset();
    await this.router.navigate(['../'], { relativeTo: this.route });
  }

  protected readonly isControlInvalid = isControlInvalid;
}
