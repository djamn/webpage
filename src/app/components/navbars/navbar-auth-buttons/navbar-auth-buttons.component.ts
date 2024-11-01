import {Component} from '@angular/core';
import {getAuth} from "firebase/auth";

@Component({
  selector: 'navbar-auth-buttons',
  templateUrl: './navbar-auth-buttons.component.html',
  styleUrl: './navbar-auth-buttons.component.css'
})
export class NavbarAuthButtonsComponent {

  protected readonly getAuth = getAuth;
}
