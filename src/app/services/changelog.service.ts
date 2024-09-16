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
            const id = a.payload.doc.id;
            return {...data, id}
          })
        })
      )
  }

  async deleteEntry(id: string) {
    try {
      await this.firestore.collection(changelogCollectionName).doc(id).delete();
      console.debug("Successfully deleted entry with id", id)
    } catch (err) {
      throw err;
    }

  }

  async updateEntry(id: string) {

  }

  async addEntry() {

  }


}
