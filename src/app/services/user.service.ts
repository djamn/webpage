import { Injectable } from '@angular/core';
import {AuthService} from "./auth.service";
import {debounceTime, map} from "rxjs";
import {ChangelogEntry} from "../types/changelog.entry.type";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../types/user.type";

const userCollectionName: string = 'user'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AuthService, private firestore: AngularFirestore) {


  }


  getUserLikedProjects() {
    // Replace 'likedProjects' with the exact document name in Firestore
    return this.firestore
      .collection(userCollectionName)   // Access user collection
      .doc<User>('likedProjectIds') // Access the 'likedProjects' document
      .snapshotChanges()                  // Get real-time updates
      .pipe(
        map(action => {
          const data = action.payload.data() as User;
          const id = action.payload.id;
          return data ? { ...data, id } : null;
        })
      );
  }

  updateUserLikedProjects() {

  }





}
