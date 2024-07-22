import {Component, Input, OnInit} from '@angular/core';
import {FirestoreService} from "../../services/firestore.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {
  @Input()
  loginInputPlaceholderPassword: string = 'Enter your password'

  @Input()
  loginInputPlaceholderEmail: string = 'Enter your email'

  @Input()
  loginInputPlaceholderUsername: string = 'Enter your username'


  data: any[];
  docId = 'clicks';
  fieldName = 'counter';
  counter: number = -1;

  constructor(private firebaseService: FirestoreService, private authService: AuthService) {
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

  // Change enforcement: https://cloud.google.com/identity-platform/docs/password-policy

  login(email: string, username: string, password: string) {
    this.authService.register(email, username, password);
  }
}
