import {Component, Input} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {CrossFieldErrorMatcher} from "./cross-field-error-matcher";
import {confirmPasswordValidator} from "./confirm-password.validator";
import {firstValueFrom} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Input()
  imageSrc: string = "/assets/no-image.svg";

  @Input()
  registerAccountHint: string =
    'By clicking Register you accept the HOST Terms of Use and acknowledge the Privacy Statement and Cookie Policy'

  errorMatcher = new CrossFieldErrorMatcher();
  signupForm: UntypedFormGroup = new UntypedFormGroup({
      username: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(5)]),
      confirmPassword: new UntypedFormControl('', [Validators.required])
    },
    {validators: confirmPasswordValidator}
  )

  @Input()
  registerInputPlaceholderPassword: string = 'Enter your password'

  @Input()
  registerInputPlaceholderEmail: string = 'Enter your email'

  @Input()
  registerInputPlaceholderUsername: string = 'Enter your username'

  hidePassword = true;
  hideConfirmPassword = true;

  togglePasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(event: MouseEvent): void {
    event.stopPropagation();
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  constructor(private authService: AuthService, private snackBar: MatSnackBar) {
  }

  async register() {
    if (!this.signupForm.valid) {
      this.showSnackbar('Your form is not valid!', 'error-snackbar', 2000);
      console.log("Form invalid");
      return;
    }

    try {
      const emailExists = await this.checkEmailExists(this.signupForm.value.email);
      if (emailExists) {
        this.showSnackbar('Email already exists!', 'error-snackbar', 1500);
        console.log("Email exists - True");
        return;
      }

      const usernameExists = await this.checkUsernameExists(this.signupForm.value.username);
      if (usernameExists) {
        this.showSnackbar('Username already exists!', 'error-snackbar', 2000);
        console.log("Username exists - True");
        return;
      }


      //Registration Logic
      // TODO


    } catch (err) {
      console.error("Registration error:", err);
      this.showSnackbar('An error occurred during registration. Please try again.', 'error-snackbar', 2000);
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

  private showSnackbar(message: string, panelClass: string, duration: number) {
    this.snackBar.open(message, 'Ok', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass],
      duration: duration
    });
  }

}

/*
Todos morgen
Register implementieren & weiterleiten => + Errorhandling
Checks implementieren (siehe github)
Host Terms?

 */
