import {Component, OnInit} from '@angular/core';
import {GuestBookEntry} from "../../../types/guestbook.entry.type";
import {Router} from "@angular/router";
import {GuestbookService} from "../../../services/guestbook.service";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'guestbook-component',
  templateUrl: './guestbook-component.component.html',
  styleUrl: './guestbook-component.component.css'
})
export class GuestbookComponent implements OnInit {
  guestBookEntries: GuestBookEntry[] = [];
  filteredGuestBookEntries: GuestBookEntry[] = [];
  hiddenEntriesCount: number = 0;
  visibleEntriesCount: number = 0;

  currentPage: number = 1;
  entriesPerPage: number = 1;
  config: any;

  constructor(
    private router: Router,
    private configService: ConfigService,
    private guestbookService: GuestbookService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    this.entriesPerPage = this.config.GUESTBOOK_ENTRIES_PER_PAGE;

    this.fetchData();
  }

  fetchData() {
    this.guestbookService.getEntries().subscribe(data => {
      this.guestBookEntries = data;
      const filteredItems = this.guestBookEntries.filter(entry => entry.is_visible);
      this.hiddenEntriesCount = this.guestBookEntries.length - filteredItems.length;
      this.visibleEntriesCount = filteredItems.length;
      this.performSearch("");
      console.log(data)
    })
  }

  performSearch(searchTerm: string) {
    this.filteredGuestBookEntries = this.guestBookEntries;
    console.warn("Search not implemented");
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    this.changePage(this.currentPage + 1);
  }

  previousPage() {
    this.changePage(this.currentPage - 1);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredGuestBookEntries.length / this.entriesPerPage);
  }

  get paginatedEntries(): any[] {
    const startIndex = (this.currentPage - 1) * this.entriesPerPage;
    return this.filteredGuestBookEntries.slice(startIndex, startIndex + this.entriesPerPage);
  }

}
