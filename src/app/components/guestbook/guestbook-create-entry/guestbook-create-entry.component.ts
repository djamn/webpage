import {Component, OnInit} from '@angular/core';
import {FormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Snackbar} from "../../../utility/snackbar";
import {isControlInvalid} from "../../../utility/form-utils";

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

  createEntry() {
    console.log(this.createEntryForm.value)
    if (!this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE) {
      this.snackbar.showSnackbar(this.translate.instant(''), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }



    if (this.createEntryForm.invalid) {
      Object.keys(this.createEntryForm.controls).forEach(field => {
        const control = this.createEntryForm.get(field);
        if (control) {
          control.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }

    console.log(true)
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
