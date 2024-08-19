import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'guestbook-page-component',
  templateUrl: './guestbook-page-component.component.html',
  styleUrl: './guestbook-page-component.component.css'
})
export class GuestbookPageComponent {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() pagePrevious: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() pageNext: EventEmitter<number> = new EventEmitter<number>();

  changePage(page: number | string) {
    if (typeof page === 'number') {
      this.pageChange.emit(page);
    }
  }

  nextPage() {
    this.pageNext.emit();
  }

  previousPage() {
    this.pagePrevious.emit();
  }

  // TODO checkout
  getPageNumbers(): (number | string)[] {
    const pages: (number | string)[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push('...');
      }
      pages.push(this.totalPages);
    }

    return pages;
  }
}
