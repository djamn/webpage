import {Component, Input, OnInit} from '@angular/core';
import {FirestoreService} from "../../services/firestore.service";
import {AuthService} from "../../services/auth.service";
import {getAuth} from "firebase/auth";
import {signOut} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {map, Observable} from "rxjs";
import {PermissionService} from "../../services/permission.service";

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {
  isAdmin$: Observable<boolean> | undefined;
  userRole$: Observable<string[]> | undefined;

  @Input()
  loginInputPlaceholderPassword: string = 'Enter your password'

  @Input()
  loginInputPlaceholderEmail: string = 'Enter your email'

  @Input()
  loginInputPlaceholderUsername: string = 'Enter your username'



  userPermissions$: Observable<string[]> | undefined;


  data: any[];
  docId = 'clicks';
  fieldName = 'counter';
  counter: number = -1;

  constructor(readonly firebaseService: FirestoreService, readonly authService: AuthService, readonly router: Router, readonly permissionService: PermissionService) {
    this.data = [];
  }

  async ngOnInit(): Promise<void> {
    this.userPermissions$ = this.permissionService.getAllPermissions().pipe(
      map(permissions => permissions.sort()) // Sort permissions alphabetically
    );

    this.isAdmin$ = this.authService.getUserRoles().pipe(
      map(roles => roles.includes('admin'))
    );

    this.userRole$ = this.authService.getUserRoles();

    try {
      this.counter = await this.firebaseService.getNumber('button-clicks', this.docId, this.fieldName);
    } catch (error) {
      console.error('Error setting counter value:', error);
    }
  }

  testButton(): void {
    this.firebaseService.incrementNumber('button-clicks', this.docId, this.counter).then(() => {
      this.counter++;
      // console.log("Number successfully incremented")
    })

    // this.authService.fetchUserRole('pNrC82iZV6W6PfxrrzUY4y7aHVq1');

    // const auth = getAuth();
    // console.log("AUTH: ", auth.currentUser)
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

  async guestbook() {
    await this.router.navigate(['/guestbook']);
  }


  // Change enforcement: https://cloud.google.com/identity-platform/docs/password-policy
  // https://www.youtube.com/watch?v=Ru-FaifP4mM&list=PL-Ps9kYNdYBzorz7yEx0SlbDOeXsEXkeG&index=3
  // login, logout, register: https://firebase.google.com/docs/auth/web/password-auth?authuser=0&hl=de#web-modular-api

  register(email: string, username: string, password: string) {
    // this.authService.register(email, username, password).then(r => console.log(r));
  }

  protected readonly getAuth = getAuth;
}
