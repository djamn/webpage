import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {firstValueFrom} from "rxjs";
import {ConfigService} from "../../../services/config.service";
import {Router} from "@angular/router";
import {Snackbar} from "../../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";
import {isControlInvalid} from "../../../utility/form-utils";
import {confirmPasswordValidator} from "./confirm-password.validator";

@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  config: any;
  signupForm!: UntypedFormGroup;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
    private router: Router,
    private snackbar: Snackbar,
    private translate: TranslateService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();

    this.signupForm = new UntypedFormGroup({
      email: new UntypedFormControl({value: '', disabled: !this.config.REGISTER_POSSIBLE}, [
        Validators.required,
        Validators.email
      ]),
      username: new UntypedFormControl({value: '', disabled: !this.config.REGISTER_POSSIBLE}, [
        Validators.required,
        Validators.maxLength(this.config.USERNAME_MAX_LENGTH),
        Validators.pattern(this.config.USERNAME_CHARACTER_PATTERN)
      ]),
      password: new UntypedFormControl({value: '', disabled: !this.config.REGISTER_POSSIBLE}, [
        Validators.required,
        Validators.minLength(this.config.PASSWORD_MIN_LENGTH)
      ]),
      confirmPassword: new UntypedFormControl({
        value: '',
        disabled: !this.config.REGISTER_POSSIBLE
      }, [Validators.required])
    }, {validators: confirmPasswordValidator});
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }


  async register() {
    if (!this.config.REGISTER_POSSIBLE) {
      this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.NO_REGISTRATION_POSSIBLE_HINT'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    if (!this.signupForm.valid) {
      this.signupForm.markAllAsTouched();
      console.debug("Register Form invalid");
      return;
    }

    try {
      const email = this.signupForm.value.email.trim().toLowerCase();
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.EMAIL_EXISTS'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        return;
      }

      const username = this.signupForm.value.username.trim().toLowerCase();
      const usernameExists = await this.checkUsernameExists(username);
      if (usernameExists) {
        this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.USERNAME_TAKEN'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        return;

      }

      await this.authService.register(email, username, this.signupForm.value.password);
      this.snackbar.showSnackbar(this.translate.instant('REGISTER.REGISTRATION_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
      this.signupForm.reset();

      await this.router.navigate(['/login'])
    } catch (err) {
      console.error("Registration error:", err);
      this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  async checkUsernameExists(username: string) {
    const exists = await firstValueFrom(this.authService.checkUsernameExists(username));
    if (exists) this.signupForm.get('username')?.setErrors({usernameTaken: true});
    else this.signupForm.get('username')?.setErrors(null);

    return exists;
  }

  async checkEmailExists(email: string) {
    const exists = await firstValueFrom(this.authService.checkEmailExists(email));
    if (exists) this.signupForm.get('email')?.setErrors({emailTaken: true});
    else this.signupForm.get('email')?.setErrors(null);

    return exists;
  }

  protected readonly isControlInvalid = isControlInvalid;
}
