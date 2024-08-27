import {Component, Input} from '@angular/core';
import {PermissionService} from "../../../services/permission.service";

@Component({
  selector: 'guestbook-main-component',
  templateUrl: './guestbook-main-component.component.html',
  styleUrl: './guestbook-main-component.component.css'
})
export class GuestbookMainComponent {
  constructor(protected permissionService : PermissionService) {
  }

  @Input()
  visibleEntriesCount: number = 0;

  @Input()
  hiddenEntriesCount: number = 0;
}
