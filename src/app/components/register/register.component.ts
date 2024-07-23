import {Component, Input, signal} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {FormControl, Validators} from "@angular/forms";

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

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly username = new FormControl('', [Validators.required]);
  errorMessageEmail = signal('');
  errorMessageUsername = signal('');

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
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  register() {
    console.log("Hallo")
  }

  // TODO recode
  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessageEmail.set('You must enter a value');

    } else if (this.email.hasError('email')) {
      this.errorMessageEmail.set('Not a valid email');
    } else if(this.username.hasError('required')){
      this.errorMessageUsername.set('You must enter a value');
    }else {
      this.errorMessageEmail.set('');
    }
  }
}

/*
Todos morgen
Register implementieren & weiterleiten => + Errorhandling
Checks implementieren (siehe github)
Host Terms?

 */
