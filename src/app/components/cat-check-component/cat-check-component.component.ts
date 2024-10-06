import { Component } from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCat} from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'cat-check-component',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './cat-check-component.component.html',
  styleUrl: './cat-check-component.component.css'
})
export class CatCheckComponent {
    faCat = faCat
}
