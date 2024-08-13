import { Component } from '@angular/core';
import {ComponentsModule} from "../../components/components.module";

@Component({
  selector: 'guestbook-create-entry',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './guestbook-create-entry.component.html',
  styleUrl: './guestbook-create-entry.component.css'
})
export class GuestbookCreateEntry {

}
