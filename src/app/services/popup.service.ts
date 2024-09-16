import {Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {DialogCommentPopupComponent} from "../components/popups/dialog-comment-popup/dialog-comment-popup.component";
import {DialogPopupComponent} from "../components/popups/dialog-popup/dialog-popup.component";
import {ChangelogPopupComponent} from "../components/popups/changelog-popup/changelog-popup.component";
import {ChangelogEntry} from "../types/changelog.entry.type";
import {data} from "autoprefixer";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private dialog: MatDialog) {
  }

  openPopup(description: string, buttonActionText: string): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogPopupComponent, {
      data: {
        description: description,
        button_action_text: buttonActionText
      }
    })

    return dialogRef.afterClosed();
  }

  openUpdateChangelogPopup(entry: ChangelogEntry): Observable<ChangelogEntry> {
    const dialogRef = this.dialog.open(ChangelogPopupComponent, {data: entry})

    return dialogRef.afterClosed();
  }

  openCreateChangelogPopup(): Observable<ChangelogEntry> {
    const dialogRef = this.dialog.open(ChangelogPopupComponent)

    return dialogRef.afterClosed();
  }

  openCommentPopup(description: string): Observable<string> {
    const dialogRef = this.dialog.open(DialogCommentPopupComponent, {data: {description: description}})

    return dialogRef.afterClosed();
  }

}
