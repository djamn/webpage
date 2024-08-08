import {Injectable} from '@angular/core';
import {getAuth} from "firebase/auth";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "@angular/fire/auth";
import {FirestoreService} from "./firestore.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {catchError, firstValueFrom, map, Observable, of} from "rxjs";

// TODO
interface User {
  email: string;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestoreService: FirestoreService, private firestore: AngularFirestore) {
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

  async register(email: string, username: string, password: string) {
    try {
      const auth = getAuth();
      await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        const user = userCredential.user;

        if (user) await this.firestoreService.registerUser(user.uid, email, username);
      })
    } catch (err) {
      throw err; // Rethrow Error
    }
  }

  async login(email: string, password: string) {
    try {
      const auth = getAuth();

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
      localStorage.setItem('userUID', uid);

      const role = await this.fetchUserRole(uid);
      localStorage.setItem('userRole', role);

    } catch (err) {
      throw err; // rethrow error
    }
  }

  logout() {
    signOut(getAuth()).then(() => {
      localStorage.removeItem('userUID');
      localStorage.removeItem('userRole');
    }).catch((err) => {
      console.error("Sign out failed:", err);
    })
  }

  // TODO move to user role service?
  async fetchUserRole(uid: string) {
    try {
      const userDoc = this.firestore.doc(`users/${uid}`).get();
      const userSnapshot = await firstValueFrom(userDoc);

      if (userSnapshot.exists) {
        const user = userSnapshot.data() as User;
        const userRole = user.role;
        console.log("This user is:", userRole)
        return userRole || 'guest';
      }

      return 'guest';
    } catch (e) {
      console.error("Error while fetching user role", e);
      return 'guest';
    }
  }

  async fetchEmailByUsername(username: string) {
    const userDoc = this.firestore.collection('users', ref => ref.where('username', '==', username)).get();
    const userSnapshot = await firstValueFrom(userDoc);
    if (!userSnapshot.empty) {
      const user = userSnapshot.docs[0].data() as User;
      return user.email;
    }
    throw new Error('auth/invalid-credential');
  }
}

