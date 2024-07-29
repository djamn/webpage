import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {CrossFieldErrorMatcher} from "./cross-field-error-matcher";
import {confirmPasswordValidator} from "./confirm-password.validator";
import {firstValueFrom} from "rxjs";
import {ConfigService} from "../../services/config.service";
import {Router} from "@angular/router";
import {Snackbar} from "../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  hidePassword = true;
  hideConfirmPassword = true;
  config: any;
  errorMatcher = new CrossFieldErrorMatcher();
  signupForm!: UntypedFormGroup;

  @Input()
  imageSrc: string = "/assets/no-image.svg";

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
      email: new UntypedFormControl({value: '', disabled: !this.config.registerPossible}, [
        Validators.required,
        Validators.email
      ]),
      username: new UntypedFormControl({value: '', disabled: !this.config.registerPossible}, [
        Validators.required,
        Validators.maxLength(this.config.usernameMaxLength)
      ]),
      password: new UntypedFormControl({value: '', disabled: !this.config.registerPossible}, [
        Validators.required,
        Validators.minLength(this.config.passwordMinLength)
      ]),
      confirmPassword: new UntypedFormControl({
        value: '',
        disabled: !this.config.registerPossible
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
    if (!this.config.registerPossible) {
      this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.NO_REGISTRATION_POSSIBLE_HINT'), 'error-snackbar', 2000);
      return;
    }

    if (!this.signupForm.valid) {
      console.debug("Register Form invalid");
      return;
    }

    try {
      const email = this.signupForm.value.email.trim().toLowerCase();
      const emailExists = await this.checkEmailExists(email);
      if (emailExists) {
        this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.EMAIL_EXISTS'), 'error-snackbar', 1500);
        return;
      }

      const username = this.signupForm.value.username.trim().toLowerCase();
      const usernameExists = await this.checkUsernameExists(username);
      if (usernameExists) {
        this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.USERNAME_TAKEN'), 'error-snackbar', 2000);
        return;
      }

      await this.authService.register(email, username, this.signupForm.value.password);
      this.snackbar.showSnackbar(this.translate.instant('REGISTER.REGISTRATION_SUCCESSFUL'), 'success-snackbar', 2000);
      this.signupForm.reset();

      await this.router.navigate(['/login'])
    } catch (err) {
      console.error("Registration error:", err);
      this.snackbar.showSnackbar(this.translate.instant('REGISTER.ERRORS.UNEXPECTED_ERROR'), 'error-snackbar', 2000);
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
}
