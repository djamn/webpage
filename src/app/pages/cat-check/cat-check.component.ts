import {Component} from '@angular/core';
import {CatCheckComponent} from "../../components/cat-check-component/cat-check-component.component";

@Component({
  selector: 'cat-check',
  standalone: true,
  imports: [
    CatCheckComponent
  ],
  templateUrl: './cat-check.component.html',
  styleUrl: './cat-check.component.css'
})
export class CatCheck {

}
