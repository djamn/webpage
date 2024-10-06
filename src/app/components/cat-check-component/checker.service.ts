import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {debounceTime} from "rxjs";
import {map} from "rxjs/operators";
import {CatChecker} from "./checker.type";

const catCheckerCollectionName: string = "cat-checker";

@Injectable({
  providedIn: 'root'
})
export class CheckerService {

  constructor(private firestore: AngularFirestore) {
  }

  async addFeedingSession(timestamp: number) {
    try {
      await this.firestore.collection(catCheckerCollectionName).add({
        timestamp: timestamp
      })
    } catch (error) {
      throw error;
    }
  }

  async deleteFeedingSession(id: string) {
    try {
      await this.firestore.collection(catCheckerCollectionName).doc(id).delete();
    } catch (error) {
      throw error;
    }
  }

  getFeedingSessions() {
    return this.firestore.collection(catCheckerCollectionName, ref => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges()
      .pipe(
        debounceTime(300), // needed to not load everything twice
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as CatChecker
            const id = a.payload.doc.id;
            return {...data, id}
          })
        })
      )
  }
}
