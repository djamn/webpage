import {Component} from '@angular/core';
import {ComponentsModule} from "../../components/components.module";

@Component({
  selector: 'app-projects',
  standalone: true,
    imports: [
        ComponentsModule
    ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class Projects {

}
