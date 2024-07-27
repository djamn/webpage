import {Component} from '@angular/core';
import {ComponentsModule} from "../../components/components.module";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class Login {

}
