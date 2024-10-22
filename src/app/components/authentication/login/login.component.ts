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

  constructor(private authService: AuthService,
              private snackbar: Snackbar,
              private configService: ConfigService,
              private router: Router,
              private translate: TranslateService) {
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

  /*
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

    // Introduce a delay if needed for rate-limiting purposes.
    await this.slowDownLogin();

    // If the input is a username (doesn't contain '@'), resolve it to an email.
    if (!usernameOrEmail.includes('@')) {
      usernameOrEmail = await this.resolveUsernameToEmail(usernameOrEmail);
    }

    // Attempt login
    await this.authService.login(usernameOrEmail, this.loginForm.value.password);

    // On successful login, reset the form and navigate
    this.loginForm.reset();
    this.isLoading = false;
    await this.router.navigate(['/']);

  } catch (err) {
    this.isLoading = false;
    this.handleError(err);
  }
}

   */

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

      await this.authService.login(usernameOrEmail, this.loginForm.value.password);

      this.loginForm.reset();
      this.isLoading = false;
      // TODO snackbar für erfolgreiches anmelden
      await this.router.navigate(['/']);
    } catch (err) {
      this.isLoading = false;
      this.handleError(err as Error);
    }
  }

  private handleError(err: Error) {
    // TODO firebase errors will not be handled
    switch (err.message) {
      case 'auth/invalid-credential':
        this.snackbar.showSnackbar('LOGIN.ERRORS.INVALID_CREDENTIALS', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        break;
      case 'auth/email-not-verified':
        this.snackbar.showSnackbar('LOGIN.ERRORS.EMAIL_NOT_VERIFIED', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        break;
      case 'auth/user-not-found':
        this.snackbar.showSnackbar('LOGIN.ERRORS.USER_NOT_FOUND', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        break;
      default:
        this.snackbar.showSnackbar('LOGIN.ERRORS.UNEXPECTED_ERROR', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        console.error("Unexpected error during login:", err.message);
    }
  }

  protected readonly isControlInvalid = isControlInvalid;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faLock = faLock;
  protected readonly faEye = faEye;
  protected readonly faEyeSlash = faEyeSlash;
}
