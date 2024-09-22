import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {debounceTime, map} from "rxjs";
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
        debounceTime(300),    // needed to not load everything twice
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

  async updateEntry(id: string, timestamp: number, changes: string[], version: string, versionCategory: string) {
    try {
      await this.firestore.collection(changelogCollectionName).doc(id).update({
        changes: changes,
        version: version,
        version_category: versionCategory,
        timestamp: timestamp
      })
    } catch (err) {
      throw err;
    }
  }

  async addEntry(timestamp: number, changes: string[], version: string, versionCategory: string) {
    console.log(timestamp, changes, version, versionCategory)
    try {
      await this.firestore.collection(changelogCollectionName).add({
        changes: changes,
        version: version,
        version_category: versionCategory,
        timestamp: timestamp
      })
    } catch (err) {
      throw err;
    }
  }
}
