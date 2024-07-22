import {Injectable} from '@angular/core';
import {getAuth} from "firebase/auth";
import {createUserWithEmailAndPassword} from "@angular/fire/auth";
import {FirestoreService} from "./firestore.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private firestoreService: FirestoreService) {
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

