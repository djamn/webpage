import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {map} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {User} from "../types/user.type";

const userCollectionName: string = 'users'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth: AuthService, private firestore: AngularFirestore) {


  }


  getUserLikedProjects() {
    return this.firestore
      .collection(userCollectionName)
      .doc(this.auth.userId)
      .snapshotChanges()
      .pipe(
        map(action => {
          const data = action.payload.data() as User;
          return data ? data['likedProjectIds'] : null;
        })
      );
  }

  async updateUserLikedProjects(likedProjectIds: string[]) {
    try {
      console.log(this.auth.userId)
      await this.firestore.collection(userCollectionName).doc(this.auth.userId).update({
        likedProjectIds: likedProjectIds
      })
    } catch (err) {
      throw err;
    }
  }
}
