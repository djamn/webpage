import {Component, Input, signal} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormControl,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from "@angular/forms";
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

  // readonly email = new FormControl('', [Validators.required, Validators.email]);
  // readonly username = new FormControl('', [Validators.required]);
  // errorMessageEmail = signal('');
  // errorMessageUsername = signal('');

  @Input()
  registerInputPlaceholderPassword: string = 'Enter your password'

  @Input()
  registerInputPlaceholderEmail: string = 'Enter your email'

  @Input()
  registerInputPlaceholderUsername: string = 'Enter your username'

  hide = signal(true);
  hideConfirm = signal(true);

  clickEventPassword(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  clickEventPasswordConfirm(event: MouseEvent) {
    this.hideConfirm.set(!this.hideConfirm());
    event.stopPropagation();
  }

  constructor(private authService: AuthService) {
    // merge(this.email.statusChanges, this.email.valueChanges)
    //   .pipe(takeUntilDestroyed())
    //   .subscribe(() => this.updateErrorMessage());
  }

  register() {
    console.log("Hallo")
    console.log(this.signupForm.value);
  }

  // TODO recode
  updateErrorMessage() {
    // if (this.email.hasError('required')) {
    //   this.errorMessageEmail.set('You must enter a value');
    //
    // } else if (this.email.hasError('email')) {
    //   this.errorMessageEmail.set('Not a valid email');
    // } else if (this.username.hasError('required')) {
    //   this.errorMessageUsername.set('You must enter a value');
    // } else {
    //   this.errorMessageEmail.set('');
    // }
  }

}

/*
Todos morgen
Register implementieren & weiterleiten => + Errorhandling
Checks implementieren (siehe github)
Host Terms?

 */
