import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {GuestbookService} from "../../../services/guestbook.service";
import {Snackbar} from "../../../utility/snackbar";
import {ConfigService} from "../../../services/config.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PopupService} from "../../../services/popup.service";
import {firstValueFrom} from "rxjs";
import {PermissionService} from "../../../services/permission.service";
import {faComment, faEye, faEyeSlash, faGear, faTrashCan} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'guestbook-entry-component',
  templateUrl: './guestbook-entry-component.component.html',
  styleUrl: './guestbook-entry-component.component.css'
})
export class GuestbookEntryComponent implements OnInit {
  @Input() entry: any;
  @Input() isLoading: boolean = false;
  creationDate: string = "";
  editDate: string = "";
  config: any;

  constructor(
    readonly translate: TranslateService,
    readonly guestbookService: GuestbookService,
    readonly snackbar: Snackbar,
    readonly configService: ConfigService,
    protected permissionService: PermissionService,
    readonly sanitizer: DomSanitizer,
    readonly popupService: PopupService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig()
    this.creationDate = this.processTimestamp(this.entry.timestamp);
    if (this.entry.edited) this.editDate = this.processTimestamp(this.entry.edited_timestamp)
  }

  async toggleEntryVisibility() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-guestbook-entry'));

    if (hasPermission) {
      const newVisibility = !this.entry.is_visible
      this.guestbookService.toggleVisibility(this.entry.id, newVisibility)
        .then(success => {
          if (success) {
            // this.entry.is_visible = newVisibility;
            this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.VISIBILITY_UPDATED_SUCCESS'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
          }
        })
    }
  }

  async addComment() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-guestbook-entry'));

    if (hasPermission) {
      this.popupService.openCommentPopup().subscribe(async comment => {
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
  }

  async editEntry() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-guestbook-entry'));

    if (hasPermission) {
      this.popupService.openUpdateEntryPopup(this.entry);
    }
  }

  async deleteEntry() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-guestbook-entry'));

    if (hasPermission) {
      this.popupService.openPopup(this.translate.instant('DIALOG.DESCRIPTION_DELETE_GUESTBOOK_ENTRY', {username: this.entry.username}), this.translate.instant('BUTTONS.BUTTON_DELETE')).subscribe(async (result) => {
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
  }

  async deleteComment() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('delete-guestbook-comment'));

    if (hasPermission) {
      this.popupService.openPopup(this.translate.instant('DIALOG.DESCRIPTION_DELETE_GUESTBOOK_COMMENT', {}), this.translate.instant('BUTTONS.BUTTON_DELETE')).subscribe(async (result) => {
        if (result) {
          try {
            await this.guestbookService.deleteComment(this.entry.id);
            this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.DELETE.COMMENT_DELETED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
          } catch (err) {
            console.error('Error deleting comment:', err);
            this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.DELETE.COMMENT_DELETION_FAILED'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          }
        }
      });
    }
  }

  processTimestamp(timestamp: any) {
    const date = new Date(timestamp)
    const formattedDate = date.toLocaleDateString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} (${hours}:${minutes} ${this.translate.instant('GENERAL.CLOCK')})`
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

    protected readonly faGear = faGear;
  protected readonly faTrashCan = faTrashCan;
  protected readonly faComment = faComment;
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEye = faEye;
}
