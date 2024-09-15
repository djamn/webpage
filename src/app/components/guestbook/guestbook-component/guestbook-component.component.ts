import {Component, OnInit} from '@angular/core';
import {GuestBookEntry} from "../../../types/guestbook.entry.type";
import {Router} from "@angular/router";
import {GuestbookService} from "../../../services/guestbook.service";
import {ConfigService} from "../../../services/config.service";
import {PermissionService} from "../../../services/permission.service";
import {firstValueFrom} from "rxjs";

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
  isLoading: boolean = true;

  currentPage: number = 1;
  entriesPerPage: number = 1;
  config: any;



  constructor(
    private router: Router,
    private configService: ConfigService,
    protected permissionService: PermissionService,
    private guestbookService: GuestbookService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    this.entriesPerPage = this.config.GUESTBOOK_ENTRIES_PER_PAGE;

    // this.isLoading = true;
    this.fetchData();
    // this.isLoading = false;
  }

  fetchData() {
    this.isLoading = true;
    this.guestbookService.getEntries().subscribe({
      next: (data) => {
        this.guestBookEntries = data;
        this.isLoading = false;
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
