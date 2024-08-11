import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class Snackbar {
  constructor(private snackBar: MatSnackBar, private translate: TranslateService) {
  }

  showSnackbar(message: string, styleClass: string, durationMs: number) {
    this.snackBar.open(message, this.translate.instant('SNACKBAR.CONFIRM_BUTTON'), {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [styleClass],
      duration: durationMs
    });
  }
}
