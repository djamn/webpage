import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {ConfigService} from "../../../services/config.service";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {Snackbar} from "../../../utility/snackbar";

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
    private snackbar: Snackbar) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();

    this.createEntryForm = new UntypedFormGroup({
      username: new UntypedFormControl({value: '', disabled: !this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE}, [
        Validators.required,
        Validators.maxLength(this.config.GUESTBOOK_USERNAME_MAX_LENGTH),
        Validators.pattern(this.config.GUESTBOOK_USERNAME_CHARACTER_PATTERN)
      ])
    })
  }

  createEntry() {
    console.log(true)
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.createEntryForm.get(controlName)!;
    return control && control.invalid && (control.dirty || control.touched);
  }
}
