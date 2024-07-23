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

  readonly email = new FormControl('', [Validators.required, Validators.email]);
  errorMessage = signal('');

  @Input()
  registerInputPlaceholderPassword: string = 'Enter your password'

  @Input()
  registerInputPlaceholderEmail: string = 'Enter your email'

  @Input()
  registerInputPlaceholderUsername: string = 'Enter your username'

  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
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

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      console.log("??")
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }
}
