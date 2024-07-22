import {Component, OnInit} from '@angular/core';
import {Firestore} from "@angular/fire/firestore";
import {FirestoreService} from "../../services/firestore.service";

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {
  data: any[];
  docId = 'clicks';
  fieldName = 'counter';
  counter: number = -1;

  constructor(private firebaseService: FirestoreService) {
    this.data = [];
  }

  ngOnInit(): void {
    this.firebaseService.getCollection('button-clicks').subscribe(data => {
      this.data = data;
      this.counter = data[0].counter;
    })
  }

  testButton(): void {
    this.firebaseService.incrementNumber('button-clicks', this.docId, this.fieldName).then(() => {
      console.log("Number successfully incremented")
    })
  }
}
