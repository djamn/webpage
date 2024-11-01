import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {ConfigService} from "../../../services/config.service";
import {Router} from "@angular/router";
import {Snackbar} from "../../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";
import {isControlInvalid} from "../../../utility/form-utils";
import {faEnvelope, faEye, faEyeSlash, faLock, faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  loginForm!: UntypedFormGroup;
  config: any;
  isLoading: boolean = false;

  constructor(readonly authService: AuthService,
              readonly snackbar: Snackbar,
              readonly configService: ConfigService,
              readonly router: Router,
              readonly translate: TranslateService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    this.loginForm = new UntypedFormGroup({
      usernameOrEmail: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
    })
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }

  async login() {
    if (this.isLoading) return;

    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      console.debug("Login Form invalid");
      return;
    }

    this.isLoading = true;

    try {
      let usernameOrEmail = this.loginForm.value.usernameOrEmail.trim().toLowerCase();
      await new Promise(resolve => setTimeout(resolve, this.config.LOGIN_SLOW_DOWN_DURATION));

      if (!usernameOrEmail.includes('@')) usernameOrEmail = await this.authService.fetchEmailByUsername(usernameOrEmail);

      const loginResult = await this.authService.login(usernameOrEmail, this.loginForm.value.password);

      if (!loginResult.emailVerified) {
        this.snackbar.showEmailSnackbar().onAction().subscribe(async () => {
          console.log("Resending email verification...");
          await this.authService.sendEmailVerification(loginResult.user);
          this.snackbar.showSnackbar(this.translate.instant('LOGIN.VERIFICATION_EMAIL_SENT'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        });

        this.isLoading = false;
        return;
      }

      this.loginForm.reset();
      this.isLoading = false;
      this.snackbar.showSnackbar(this.translate.instant('LOGIN.LOGIN_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      await this.router.navigate(['/']);
    } catch (err) {
      this.isLoading = false;
      this.handleError(err as Error);
    }
  }

  private handleError(err: Error) {
    if (this.isFirebaseError(err)) {
      switch (err.code) {
        case 'auth/invalid-credential':
        case 'auth/invalid-email':
          this.snackbar.showSnackbar(this.translate.instant('LOGIN.ERRORS.INVALID_CREDENTIALS'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          break;
        case 'auth/user-not-found':
          this.snackbar.showSnackbar(this.translate.instant('LOGIN.ERRORS.USER_NOT_FOUND'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          break;
        case 'auth/user-disabled':
          this.snackbar.showSnackbar(this.translate.instant('LOGIN.ERRORS.USER_DISABLED'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          break;
        default:
          console.error("Unexpected error during login:", err.message);
          this.snackbar.showSnackbar(this.translate.instant('LOGIN.ERRORS.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          break;
      }
    } else {
      console.error("Non-Firebase error during login:", err.message);
      this.snackbar.showSnackbar(this.translate.instant('LOGIN.ERRORS.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  private isFirebaseError(err: any): err is { code: string } {
    return typeof err === 'object' && err !== null && 'code' in err;
  }

  protected readonly isControlInvalid = isControlInvalid;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faLock = faLock;
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
}
