import {Component, OnInit} from '@angular/core';
import {GuestBookEntry} from "../../../types/guestbook.entry.type";
import {Router} from "@angular/router";
import {GuestbookService} from "../../../services/guestbook.service";
import {ConfigService} from "../../../services/config.service";
import {PermissionService} from "../../../services/permission.service";

@Component({
  selector: 'guestbook-component',
  templateUrl: './guestbook-component.component.html',
  styleUrl: './guestbook-component.component.css'
})
export class GuestbookComponent implements OnInit {
  guestBookEntries: GuestBookEntry[] = [];
  filteredGuestBookEntries: GuestBookEntry[] = [
    {
      title: 'Coole Webseite!',
      entry_id: 0,
      username: 'David',
      timestamp: 0,
      is_visible: true,
      entry_message: "Mega coole Webseite, freut mich!",
      edited: false,
      edited_timestamp: 0,
      silent_edit: false,
      comment: '',
      user_uid: ''
    },
    {
      title: 'Lorem ipsum dolor sit amet',
      entry_id: 0,
      username: 'Peter',
      timestamp: 0,
      is_visible: true,
      entry_message: "orem ipsum dolor sit amet, consetetur sadipscing elitir elitir elitir elitir elitir elitir elitir elitir elitir eliti",
      edited: true,
      edited_timestamp: 0,
      silent_edit: false,
      comment: 'Freut mich!!',
      user_uid: ''
    }
  ];
  hiddenEntriesCount: number = 0;
  visibleEntriesCount: number = 0;
  isLoading: boolean = true;

  currentPage: number = 1;
  entriesPerPage: number = 1;
  config: any;


  constructor(
    readonly configService: ConfigService,
    readonly permissionService: PermissionService,
    readonly guestbookService: GuestbookService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    this.entriesPerPage = this.config.GUESTBOOK_ENTRIES_PER_PAGE;

    this.fetchData();
  }

  fetchData() {
    this.isLoading = true;
    this.guestbookService.getEntries().subscribe({
      next: (data) => {
        console.log(data)
        this.guestBookEntries = data;
        this.filterEntries();
        this.updateCounts();
        this.performSearch("");
      },
      error: (err) => {
        console.error('Error fetching guestbook entries:', err);
        this.isLoading = false
      },
    });
  }


  filterEntries() {
    this.permissionService.hasPermission('view-invisible-guestbook-entries').subscribe(hasPermission => {
      this.filteredGuestBookEntries = this.guestBookEntries.filter(entry =>
        hasPermission || entry.is_visible
      );
      this.isLoading = false;
    });
  }

  updateCounts() {
    const filteredItems = this.guestBookEntries.filter(entry => entry.is_visible);
    this.hiddenEntriesCount = this.guestBookEntries.length - filteredItems.length;
    this.visibleEntriesCount = filteredItems.length;
  }

  performSearch(searchTerm: string) {
    // this.filteredGuestBookEntries = this.guestBookEntries;
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
