import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs";
import {GuestBookEntry} from "../types/guestbook.entry.type";
import {Snackbar} from "../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";

const guestbookCollectionName: string = 'guestbook-entries'

@Injectable({
  providedIn: 'root'
})
export class GuestbookService {

  constructor(private firestore: AngularFirestore, private snackbar: Snackbar, private translate: TranslateService) {
  }

  async addEntry(username: string, timestamp: number, status: string, isVisible: boolean, entryMessage: string) {
    try {
      await this.firestore.collection(guestbookCollectionName).add({
        username: username,
        timestamp: timestamp,
        status: status,
        is_visible: isVisible,
        entry_message: entryMessage,
        comment: null,
        edited: false,
        silent_edit: false
      })
      console.debug("Entry created successfully!")
    } catch (error) {
      throw error;
    }
  }

  async updateEntry(id: string, username: string, timestamp: number, silentEdit: boolean, entryMessage: string) {
    try {
      await this.firestore.collection(guestbookCollectionName).doc(id).update({
        username: username,
        edited: true,
        silent_edit: silentEdit,
        entry_message: entryMessage,
      });
      console.debug('Entry updated successfully');
    } catch (error) {
      throw error;
    }
  }

  getEntries() {
    return this.firestore.collection(guestbookCollectionName, ref => ref.orderBy('timestamp', 'desc'))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as GuestBookEntry;
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
      );
  }

  async deleteEntry(id: string) {
    try {
      await this.firestore.collection(guestbookCollectionName).doc(id).delete();
      console.debug("Entry deleted successfully");
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(id: string) {
    try {
      await this.firestore.collection(guestbookCollectionName).doc(id).update({comment: null});
      console.debug("Entry deleted successfully");
    } catch (error) {
      throw error;
    }
  }

  async addComment(id: string, comment: string) {
    try {
      await this.firestore.collection(guestbookCollectionName).doc(id).update({comment: comment})
      console.debug("Comment successfully added!");
    } catch (error) {
      throw error;
    }
  }

  // TODO rework to await
  async toggleVisibility(id: string, newVisibility: boolean): Promise<boolean> {
    return this.firestore.collection(guestbookCollectionName).doc(id).update({
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
