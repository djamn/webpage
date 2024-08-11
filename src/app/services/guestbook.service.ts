import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map, Timestamp} from "rxjs";
import {GuestBookEntry} from "../types/guestBookEntry.type";
import {Snackbar} from "../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";
import {Time} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class GuestbookService {

  constructor(private firestore: AngularFirestore, private snackbar: Snackbar, private translate: TranslateService) {
  }

  addEntry(username: string, timestamp: number, status: string, isVisible: boolean, entryText: string) {
    this.firestore.collection('guestbook-entries').add({
      username: username,
      timestamp: timestamp,
      status: status,
      is_visible: isVisible,
      entry_text: entryText,
      comment: null
    }).then(() => {
      // TODO
      console.log('New entry added successfully');
    }).catch((error) => {
      console.error('Error adding new entry: ', error);
    });
  }

  getEntries() {
    return this.firestore.collection('guestbook-entries', ref => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as GuestBookEntry;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  async toggleVisibility(id: string, newVisibility: boolean): Promise<boolean> {
    return this.firestore.collection('guestbook-entries').doc(id).update({
      is_visible: newVisibility,
      status: newVisibility ? 'visible' : 'invisible'
    }).then(() => {
      return true;
    }).catch((err) => {
      this.snackbar.showSnackbar(this.translate.instant('GUESTBOOK.UNEXPECTED_ERROR'), 'error-snackbar', 2000);
      console.error("Error updating visibility:", err);
      return false;
    });
  }

}
