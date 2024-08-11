import {Injectable} from '@angular/core';
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {map} from "rxjs";
import {GuestBookEntry} from "../types/guestBookEntry.type";
import {Snackbar} from "../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class GuestbookService {

  constructor(private firestore: AngularFirestore, private snackbar: Snackbar, private translate: TranslateService) {
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
