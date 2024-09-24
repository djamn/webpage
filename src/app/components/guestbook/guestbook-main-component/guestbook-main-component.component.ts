import {Component, Input} from '@angular/core';
import {PermissionService} from "../../../services/permission.service";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'guestbook-main-component',
  templateUrl: './guestbook-main-component.component.html',
  styleUrl: './guestbook-main-component.component.css'
})
export class GuestbookMainComponent {
  config: any;
  constructor(protected permissionService : PermissionService, private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }

  @Input()
  visibleEntriesCount: number = 0;

  @Input()
  hiddenEntriesCount: number = 0;
}
