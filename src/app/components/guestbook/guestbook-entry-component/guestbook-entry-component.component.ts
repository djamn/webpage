import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {GuestbookService} from "../../../services/guestbook.service";
import {Snackbar} from "../../../utility/snackbar";
import {ConfigService} from "../../../services/config.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PopupService} from "../../../services/popup.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

@Component({
  selector: 'guestbook-entry-component',
  templateUrl: './guestbook-entry-component.component.html',
  styleUrl: './guestbook-entry-component.component.css'
})
export class GuestbookEntryComponent implements OnInit {
  @Input() entry: any;
  formattedDate: string = "";
  hours: string = "";
  minutes: string = "";
  config: any;

  constructor(
    private translate: TranslateService,
    private guestbookService: GuestbookService,
    private snackbar: Snackbar,
    private configService: ConfigService,
    private sanitizer: DomSanitizer,
    private popupService: PopupService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig()
    this.processTimestamp(this.entry.timestamp);
  }

  processTimestamp(timestamp: any) {
    const date = new Date(timestamp)
    this.formattedDate = date.toLocaleDateString();
    this.hours = date.getHours().toString().padStart(2, '0');
    this.minutes = date.getMinutes().toString().padStart(2, '0');
  }

  hasPermission() {
    return true;
  }

  toggleEntryVisibility() {
    const newVisibility = !this.entry.is_visible
    this.guestbookService.toggleVisibility(this.entry.id, newVisibility)
      .then(success => {
        if (success) {
          this.entry.is_visible = newVisibility;
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.VISIBILITY_UPDATED_SUCCESS'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        }
      })
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  addComment() {
    this.popupService.openCommentPopup("Comment").subscribe(result => {
      if (result) {
        console.log("Works!")
      }
    })
  }

  editEntry() {

  }

  deleteEntry() {
    this.popupService.openPopup(this.translate.instant('DIALOG.DESCRIPTION_DELETE_GUESTBOOK_ENTRY', {username: this.entry.username})).subscribe(result => {
      if (result) {
        console.log("Works")
      }
    })
  }
}
