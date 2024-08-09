import {Component} from '@angular/core'
import {ComponentsModule} from "../../components/components.module";
import {NgIf} from "@angular/common";
import {Meta, Title} from "@angular/platform-browser";

@Component({
  selector: 'guestbook',
  standalone: true,
  imports: [ComponentsModule, NgIf],
  templateUrl: 'guestbook.component.html',
  styleUrls: ['guestbook.component.css'],
})
export class Guestbook {
  constructor(private title: Title, private meta: Meta) {
    this.title.setTitle('Guestbook - Webpage')
    this.meta.addTags([
      {
        property: 'og:title',
        content: 'Guestbook',
      },
    ])
  }
}
