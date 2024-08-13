import {Component, Input} from '@angular/core';

@Component({
  selector: 'guestbook-main-component',
  templateUrl: './guestbook-main-component.component.html',
  styleUrl: './guestbook-main-component.component.css'
})
export class GuestbookMainComponent {
  @Input()
  visibleEntriesCount: number = 0;

  @Input()
  hiddenEntriesCount: number = 0;

    hasPermission() {
      return true;
    }
}
