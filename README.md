https://medium.com/@christianaxtmn/adding-firebase-to-angular-17-5c5a7cf4aba8
ng b --configuration development --deploy-url /tests/webpage/


Remove "baseHref": "/tests/webpage/", in Angular.js 


Config impl?

https://stackoverflow.com/questions/78408174/angular-17-external-configuration


Gutes GitHub: https://github.com/PranavBhatia/ng-crypto/blob/Firebase-Authentication-Password-Reset/src/app/auth/signup/signup-form/signup-form.component.ts



RoleGuard
export class RoleGuard implements CanActivate {
constructor(private authService: AuthService, private router: Router) {
}

canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
const requiredRole = route.data['requiredRole'];
const currentRole = this.authService.getRole();

    if (requiredRole && currentRole && requiredRole.includes(currentRole)) {
      return true;
    } else {
      this.router.navigate(['/unauthorized']);
      return false;
    }
}
}

Localstorage
getIsAdmin(): boolean {
return localStorage.getItem("isAdmin") === "true";
}

isGuest(): boolean {
return !localStorage.getItem('authToken')
}

getRole(): string {
if (!localStorage.getItem('authToken')) {
return "guest"
} else {
if (this.getIsAdmin()) {
return "admin"
} else {
return "user"
}
}
}

        localStorage.setItem('authToken', response.token);
        localStorage.setItem('isAdmin', response.is_admin);
        localStorage.setItem('user_id', response.user_id);

```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, from } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = getAuth();
  private firestore = getFirestore();
  private userSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();
  private userRoleCache: { [uid: string]: string } = {};
  private TOKEN_KEY = 'authToken';

  constructor(private router: Router, private cookieService: CookieService) {
    const token = this.cookieService.get(this.TOKEN_KEY);
    if (token) {
      this.auth.onAuthStateChanged(user => {
        if (user) {
          this.userSubject.next(user);
          this.cacheUserRole(user);
        } else {
          this.userSubject.next(null);
        }
      });
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      this.cookieService.set(this.TOKEN_KEY, token, { httpOnly: true, secure: true });
      this.userSubject.next(user);
      await this.cacheUserRole(user); // Cache the user role on login
    } catch (err) {
      throw err; // rethrow error
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
    this.cookieService.delete(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  private async cacheUserRole(user: User): Promise<void> {
    const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      this.userRoleCache[user.uid] = data['is_admin'] ? 'admin' : 'user';
    }
  }

  getUserRole(user: User): Observable<string | null> {
    if (this.userRoleCache[user.uid]) {
      return of(this.userRoleCache[user.uid]);
    } else {
      return from(getDoc(doc(this.firestore, 'users', user.uid))).pipe(
        map(userDoc => {
          if (userDoc.exists()) {
            const data = userDoc.data();
            const role = data['is_admin'] ? 'admin' : 'user';
            this.userRoleCache[user.uid] = role;
            return role;
          }
          return null;
        }),
        catchError(() => of(null))
      );
    }
  }
}

```

```typescript
import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input('appHasRole') role: string;
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.user$.pipe(
      switchMap(user => user ? this.authService.getUserRole(user) : of(null))
    ).subscribe(userRole => {
      if (userRole === this.role && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (userRole !== this.role && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }
}

```
