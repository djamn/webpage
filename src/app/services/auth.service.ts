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
  isLoggedIn$: Observable<boolean>;
  /** User data of database */
  user$: Observable<User | null | undefined>;
  /** User data of firebase authentication */
    // currentUserAuth$: Observable<User | null>; // TODO (equivalent to getAuth.currentUser)
  userRoles$: Observable<string[]>;
  userId: string | undefined = undefined;

  constructor(readonly firestore: AngularFirestore, readonly fireAuth: AngularFireAuth, readonly router: Router) {
    this.user$ = this.fireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          this.userId = user.uid;
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          this.userId = undefined;
          return new Observable<User | null>(observer => observer.next(null));
        }
      })
    );

    this.isLoggedIn$ = this.fireAuth.authState.pipe(
      map(user => !!user) // Emit true if user exists, else false
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

  async sendEmailVerification(user: any) {
    if (user) await user.sendEmailVerification();
  }

  async verifyEmail(uid: string) {
    try {
      await this.firestore.collection('users').doc(uid).update({
        emailVerified: true,
      })
    } catch (err) {
      console.error("Error setting email verified to true:", err)
    }
  }

  async updateLoginDate(uid: string) {
    try {
      await this.firestore.collection('users').doc(uid).update({
        lastLogin: Date.now(),
      })
    } catch (err) {
      console.error("Error updating last login date:", err)
    }
  }

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
        roles: ['user'],
        likedProjectIds: [],
        createdAt: Date.now(),
        lastLogin: null,
        emailVerified: false
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
      return {user, emailVerified: false};
    }

    // await this.verifyEmail(user.uid)   // TODO
    await this.updateLoginDate(user.uid)
    return {user, emailVerified: true};
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.fireAuth.sendPasswordResetEmail(email);
      console.log('Password reset email sent');
    } catch (err) {
      console.error('Error sending password reset email:', err);
      throw err;
    }
  }

  async logout() {
    await this.fireAuth.signOut();
    await this.router.navigate(['/login']);
  }

  getUserRoles(): Observable<string[]> {
    return this.userRoles$;
  }
}

