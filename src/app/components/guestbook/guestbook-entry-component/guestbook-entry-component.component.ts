import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {GuestbookService} from "../../../services/guestbook.service";
import {Snackbar} from "../../../utility/snackbar";
import {ConfigService} from "../../../services/config.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PopupService} from "../../../services/popup.service";

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
    this.popupService.openCommentPopup(this.translate.instant('DIALOG.DESCRIPTION_ADD_GUESTBOOK_COMMENT')).subscribe(async comment => {
      if (comment) {
        try {
          await this.guestbookService.addComment(this.entry.id, comment);
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.COMMENT_CREATION_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        } catch (err) {
          console.error('Error commenting on entry:', err);
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.CREATE.ERRORS.COMMENT_CREATION_FAILED'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        }
      }
    });
  }

  editEntry() {
    console.log("TODO not implemented")
  }

  async deleteEntry() {
    this.popupService.openPopup(this.translate.instant('DIALOG.DESCRIPTION_DELETE_GUESTBOOK_ENTRY', {username: this.entry.username})).subscribe(async (result) => {
      if (result) {
        try {
          await this.guestbookService.deleteEntry(this.entry.id);
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.DELETE.ENTRY_DELETED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        } catch (err) {
          console.error('Error deleting entry:', err);
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.DELETE.ENTRY_DELETION_FAILED'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        }
      }
    });
  }

  async deleteComment() {
    this.popupService.openPopup(this.translate.instant('DIALOG.DESCRIPTION_DELETE_GUESTBOOK_COMMENT', {})).subscribe(async (result) => {
      if (result) {
        try {
          await this.guestbookService.deleteComment(this.entry.id);
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.DELETE.COMMENT_DELETED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        } catch (err) {
          console.error('Error deleting comment:', err);
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.DELETE.COMMENT_DELETED_SUCCESSFUL'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
        }
      }
    });
  }
}
