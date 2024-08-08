import {Component, Input, OnInit} from '@angular/core';
import {FirestoreService} from "../../services/firestore.service";
import {AuthService} from "../../services/auth.service";
import {getAuth} from "firebase/auth";
import {signOut} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {map, Observable} from "rxjs";

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {
  isAdmin$: Observable<boolean> | undefined;
  userRole$: Observable<string | null> | undefined;

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

  constructor(private firebaseService: FirestoreService, private authService: AuthService, private router: Router) {
    this.data = [];
  }

  ngOnInit(): void {
    this.isAdmin$ = this.authService.getUserRole().pipe(
      map(role => role === 'admin')
    );

    this.userRole$ = this.authService.getUserRole();

    this.firebaseService.getCollection('button-clicks').subscribe(data => {
      this.data = data;
      this.counter = data[0].counter;
    })
  }

  testButton(): void {
    this.firebaseService.incrementNumber('button-clicks', this.docId, this.fieldName).then(() => {
      console.log("Number successfully incremented")
    })

    this.authService.fetchUserRole('pNrC82iZV6W6PfxrrzUY4y7aHVq1');

    const auth = getAuth();
    console.log("AUTH: ", auth.currentUser)
  }

  logout() {
    const auth = getAuth();
    signOut(auth).then(() => {
      console.log("Signout Successful")
    }).catch((error) => {
      // An error happened.
    });
  }

  async login() {
    await this.router.navigate(['/login']);
  }

  // Change enforcement: https://cloud.google.com/identity-platform/docs/password-policy
  // https://www.youtube.com/watch?v=Ru-FaifP4mM&list=PL-Ps9kYNdYBzorz7yEx0SlbDOeXsEXkeG&index=3
  // login, logout, register: https://firebase.google.com/docs/auth/web/password-auth?authuser=0&hl=de#web-modular-api

  register(email: string, username: string, password: string) {
    // this.authService.register(email, username, password).then(r => console.log(r));
  }

  protected readonly getAuth = getAuth;
}
