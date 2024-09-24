import {Component, Input} from '@angular/core';
import {PermissionService} from "../../../services/permission.service";
import {ConfigService} from "../../../services/config.service";
import {PopupService} from "../../../services/popup.service";
import {Snackbar} from "../../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";
import {GuestbookService} from "../../../services/guestbook.service";

@Component({
  selector: 'guestbook-main-component',
  templateUrl: './guestbook-main-component.component.html',
  styleUrl: './guestbook-main-component.component.css'
})
export class GuestbookMainComponent {
  config: any;
  constructor(protected permissionService: PermissionService,
              private configService: ConfigService,
              private snackbar: Snackbar,
              private guestbookService: GuestbookService,
              private translate: TranslateService,
              private popupService: PopupService) {
    this.config = this.configService.getConfig();
  }

  @Input()
  visibleEntriesCount: number = 0;

  @Input()
  hiddenEntriesCount: number = 0;

  async createEntry() {
    if(!this.config.GUESTBOOK_ENTRY_CREATION_POSSIBLE) return;

    this.popupService.openCreateEntryPopup().subscribe(async (result) => {
      if(result) {
        try {
          // await this.guestbookService.addEntry()
        } catch(err) {
          console.error("Error while creating guestbook entry", err);
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        }
      }
    })
  }
}
