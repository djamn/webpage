import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {catchError, firstValueFrom, map, Observable, of, switchMap} from "rxjs";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {User} from "../types/user.type";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null | undefined>;
  userRoles$: Observable<string[]>;

  constructor(private firestore: AngularFirestore, private fireAuth: AngularFireAuth, private router: Router) {
    this.user$ = this.fireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return new Observable<User | null>(observer => observer.next(null));
        }
      })
    );

    this.userRoles$ = this.user$.pipe(
      map(user => user ? user.roles : ['guest']) // Default to array with 'guest' if no roles
    );
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.firestore.collection('users', ref => ref.where('username', '==', username))
      .valueChanges()
      .pipe(
        map(users => users.length > 0),
        catchError(() => of(false))
      );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.firestore.collection('users', ref => ref.where('email', '==', email))
      .valueChanges()
      .pipe(
        map(users => users.length > 0),
        catchError(() => of(false))
      );
  }

  // TODO register -> verification -> auto login
  // TODO ansonsten kein login möglich

  async register(email: string, username: string, password: string) {
    try {
      const userCredential = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await this.registerUser(user.uid, email, username);
        await user.sendEmailVerification();
        console.debug("Verification send");
        await this.logout();
        await this.router.navigate(['/login']);
      }
    } catch (err) {
      throw err; // Rethrow Error
    }
  }

  async registerUser(userId: string, email: string, username: string): Promise<void> {
    try {
      await this.firestore.collection('users').doc(userId).set({
        uid: userId,
        email: email,
        username: username,
        roles: ['user']
      });
    } catch (err) {
      throw err;
    }
  }

  async fetchEmailByUsername(username: string) {
    const userDoc = this.firestore.collection('users', ref => ref.where('username', '==', username)).get();
    const userSnapshot = await firstValueFrom(userDoc);

    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0].data() as User;
      return user.email;
    }

    throw {code: 'auth/invalid-credential'};
  }

  async login(email: string, password: string) {
      const userCredential = await this.fireAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (!user) {
        throw {code: 'auth/user-not-found'};
      }

      if (!user.emailVerified) {
        await this.fireAuth.signOut();
        throw {code: 'auth/email-not-verified'};
      }
  }


  async logout() {
    await this.fireAuth.signOut();
    await this.router.navigate(['/login']);
  }

  getUserRoles(): Observable<string[]> {
    return this.userRoles$;
  }

  getUser(): Observable<User | null | undefined> {
    return this.user$;
  }
}

