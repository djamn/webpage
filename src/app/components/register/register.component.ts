import {Component, Input, signal} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {CrossFieldErrorMatcher} from "./cross-field-error-matcher";
import {confirmPasswordValidator} from "./confirm-password.validator";

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
  constructor(private authService: AuthService) {
  }

  register() {
    console.log(this.signupForm.get('confirmPassword'))
    console.log(this.signupForm.value);
    console.log(this.signupForm.valid);
  }

}

/*
Todos morgen
Register implementieren & weiterleiten => + Errorhandling
Checks implementieren (siehe github)
Host Terms?

 */
