import {Component, OnInit} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {ConfigService} from "../../services/config.service";
import {Router} from "@angular/router";
import {Snackbar} from "../../utility/snackbar";

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  hidePassword = true;
  loginForm!: UntypedFormGroup;

  constructor(private authService: AuthService, private snackbar: Snackbar, private configService: ConfigService, private router: Router) {
  }

  ngOnInit() {
    this.loginForm = new UntypedFormGroup({
      usernameOrEmail: new UntypedFormControl('', [Validators.required]),
      password: new UntypedFormControl('', [Validators.required]),
    })
  }

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }

  updateCheckbox(event: boolean) {
    console.log("Check") // TODO
  }

  async login() {
    if (!this.loginForm.valid) {
      console.debug("Login Form invalid");
      return;
    }

    let usernameOrEmail = this.loginForm.value.usernameOrEmail.trim().toLowerCase();

    try {
      const isEmail = usernameOrEmail.includes('@');
      if (!isEmail) usernameOrEmail = await this.authService.fetchEmailByUsername(usernameOrEmail);

      await this.authService.login(usernameOrEmail, this.loginForm.value.password);
      this.loginForm.reset();
      await this.router.navigate(['']);
    } catch (err) {
      // TODO recode
      if (this.isFirebaseError(err) && err.code === 'auth/invalid-credential' || err instanceof Error && err.message === 'auth/invalid-credential') {
        this.snackbar.showSnackbar('Invalid login data!', 'error-snackbar', 2000);
      } else {
        this.snackbar.showSnackbar('An unexpected error occurred', 'error-snackbar', 2000);
        console.log("Unexpected error occurred in login():", err)
      }
    }
  }

  // Type guard to check if error is a Firebase error
  private isFirebaseError(err: any): err is { code: string } {
    return typeof err === 'object' && err !== null && 'code' in err;
  }
}
