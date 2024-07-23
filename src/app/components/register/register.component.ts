import {Component, Input} from '@angular/core';

@Component({
  selector: 'register-component',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  @Input()
  imageSrc: string = "/assets/no-image.svg";

  register() {
    console.log("Hallo")
  }
}
