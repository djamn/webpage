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

  changePage(page: number) {
    this.pageChange.emit(page);
  }

  nextPage() {
    this.pageNext.emit();
  }

  previousPage() {
    this.pagePrevious.emit();
  }
}
