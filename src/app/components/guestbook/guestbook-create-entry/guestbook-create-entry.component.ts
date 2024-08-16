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
      ])
    })
  }

  createEntry() {
    if(!this.createEntryForm.valid) {
      console.log(false);
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
