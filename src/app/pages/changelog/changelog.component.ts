import { Component } from '@angular/core';
import {ComponentsModule} from "../../components/components.module";

@Component({
  selector: 'app-changelog',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class Changelog {

}
