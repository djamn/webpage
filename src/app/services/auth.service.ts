import {Injectable} from '@angular/core';
import {getAuth} from "firebase/auth";
import {createUserWithEmailAndPassword} from "@angular/fire/auth";
import {FirestoreService} from "./firestore.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestoreService: FirestoreService, private firestore : AngularFirestore) {
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

        if (user) {
          await this.firestoreService.registerUser(user.uid, email, username);
          console.log('User created:', user);
          // this.router.navigate(['/dashboard']); // Navigate to dashboard or another route after successful login
        }
      })
    } catch (err) {
      console.error('Error creating user:', err);
    }
  }
}

