import { Injectable } from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs";
import {GuestBookEntry} from "../types/guestBookEntry.type";

@Injectable({
  providedIn: 'root'
})
export class GuestbookService {

  constructor(private firestore: AngularFirestore) {
  }

  getEntries() {
    return this.firestore.collection('guestbook-entries').snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as GuestBookEntry;
          const id = a.payload.doc.id;
          return {id, ...data};
        })
      })
    )
  }
}
