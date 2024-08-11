import {Component, OnInit} from '@angular/core';
import {GuestBookEntry} from "../../types/guestBookEntry.type";
import {Router} from "@angular/router";
import {GuestbookService} from "../../services/guestbook.service";

@Component({
  selector: 'guestbook-component',
  templateUrl: './guestbook-component.component.html',
  styleUrl: './guestbook-component.component.css'
})
export class GuestbookComponent implements OnInit{
  guestBookEntries: GuestBookEntry[] = [];
  filteredGuestBookEntries: GuestBookEntry[] = []

  constructor(private router : Router, private guestbookService: GuestbookService) {

  }

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.guestbookService.getEntries().subscribe(data => {
      this.guestBookEntries = data;
      this.performSearch("");
      console.log(data)
    })
  }

  performSearch(searchTerm: string) {
    console.warn("Search not implemented");
  }



}
