import {Component, Input, OnInit} from '@angular/core';
import {FirestoreService} from "../../services/firestore.service";
import {AuthService} from "../../services/auth.service";
import {log} from "@angular-devkit/build-angular/src/builders/ssr-dev-server";

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
  // https://www.youtube.com/watch?v=Ru-FaifP4mM&list=PL-Ps9kYNdYBzorz7yEx0SlbDOeXsEXkeG&index=3
  // login, logout, register: https://firebase.google.com/docs/auth/web/password-auth?authuser=0&hl=de#web-modular-api

  login(email: string, username: string, password: string) {
    this.authService.register(email, username, password).then(r => console.log(r));
  }
}
