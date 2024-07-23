import {Component, Input, signal} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {merge} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login-form-test',
  templateUrl: './login-form-test.component.html',
  styleUrl: './login-form-test.component.css'
})
export class LoginFormTestComponent {
  readonly mail = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');

  @Input()
  loginInputPlaceholderPassword: string = 'Enter your password'

  @Input()
  loginInputPlaceholderEmail: string = 'Enter your email'

  @Input()
  loginInputPlaceholderUsername: string = 'Enter your username'

  constructor(private authService: AuthService) {
    merge(this.mail.statusChanges, this.mail.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.mail.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.mail.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  login(email: string | null, username: string, password: string) {
    if(email) {
      this.authService.register(email, username, password).then(r => console.log(r));
    }
  }
}
