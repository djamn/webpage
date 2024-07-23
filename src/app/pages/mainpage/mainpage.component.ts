import {Component} from '@angular/core'
import {ComponentsModule} from "../../components/components.module";
import {NgIf} from "@angular/common";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'mainpage',
  standalone: true,
  imports: [ComponentsModule, NgIf],
  templateUrl: 'mainpage.component.html',
  styleUrls: ['mainpage.component.css'],
})
export class MainPage {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Mainpage - Webpage')
    this.meta.addTags([
      {
        property: 'og:title',
        content: 'Mainpage Webpage',
      },
    ])
  }
}
