import {Component, Injectable} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Observable} from "rxjs";
import {DialogCommentPopupComponent} from "../components/popups/dialog-comment-popup/dialog-comment-popup.component";
import {DialogPopupComponent} from "../components/popups/dialog-popup/dialog-popup.component";

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private dialog: MatDialog) {
  }

  openPopup(description: string, buttonActionText: string): Observable<boolean>  {
    const dialogRef = this.dialog.open(DialogPopupComponent, {data: {description: description, button_action_text: buttonActionText}})

    return dialogRef.afterClosed();
  }

  openCommentPopup(description: string): Observable<string>  {
    const dialogRef = this.dialog.open(DialogCommentPopupComponent, {data: {description: description}})

    return dialogRef.afterClosed();
  }

}
