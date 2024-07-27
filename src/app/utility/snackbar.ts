import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class Snackbar {
  constructor(private snackBar: MatSnackBar) {
  }
  showSnackbar(message: string, panelClass: string, duration: number) {
    this.snackBar.open(message, 'Ok', {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [panelClass],
      duration: duration
    });
  }
}
