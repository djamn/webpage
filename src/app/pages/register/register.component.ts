import {Component} from '@angular/core';
import {ComponentsModule} from "../../components/components.module";

@Component({
  selector: 'register',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class Register {

}
