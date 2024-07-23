import {Component, Input} from '@angular/core';

@Component({
  selector: 'login-register-image-component',
  templateUrl: './login-register-image.component.html',
  styleUrl: './login-register-image.component.css'
})
export class LoginRegisterImageComponent {
  @Input()
  imageAlt: string = ""
  imageSrc: string = "/assets/no-image.svg"
}
