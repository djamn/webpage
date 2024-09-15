import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs";
import {ChangelogEntry} from "../types/changelog.entry.type";

const changelogCollectionName: string = 'changelogs'

@Injectable({
  providedIn: 'root'
})
export class ChangelogService {

  constructor(private firestore: AngularFirestore) {
  }

  getEntries() {
    return this.firestore.collection(changelogCollectionName, ref => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as ChangelogEntry
            return {...data}
          })
        })
      )
  }
}
