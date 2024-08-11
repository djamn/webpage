import {Component, Input, OnInit} from '@angular/core';
import {GuestBookEntry} from "../../types/guestBookEntry.type";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'guestbook-entry-component',
  templateUrl: './guestbook-entry-component.component.html',
  styleUrl: './guestbook-entry-component.component.css'
})
export class GuestbookEntryComponent implements OnInit{
  @Input() entry: any;
  formattedDate: string = "";
  hours: string = "";
  minutes: string = "";

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.processTimestamp(this.entry.timestamp);
  }

  processTimestamp(timestamp: any) {
    const date = new Date(timestamp.seconds * 1000);
    this.formattedDate = date.toLocaleDateString();
    this.hours = date.getHours().toString().padStart(2, '0');
    this.minutes = date.getMinutes().toString().padStart(2, '0');
  }

  hasPermission() {
    return true;
  }
}
