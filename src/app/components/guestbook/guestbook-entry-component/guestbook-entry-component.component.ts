import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {GuestbookService} from "../../../services/guestbook.service";
import {Snackbar} from "../../../utility/snackbar";
import {ConfigService} from "../../../services/config.service";
import { Timestamp } from 'firebase/firestore';

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
    private configService: ConfigService) {
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
          console.log(this.config.SNACKBAR_SUCCESS_DURATION)
          this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.VISIBILITY_UPDATED_SUCCESS'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        }
      })
  }

  createEntry() {
    this.guestbookService.addEntry("user", Date.now(), "test", true, "Hallo hier steht was2")
  }
}