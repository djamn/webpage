import {MatSnackBar} from "@angular/material/snack-bar";
import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {AuthService} from "../services/auth.service";
import {ConfigService} from "../services/config.service";

@Injectable({
  providedIn: 'root'
})
export class Snackbar {
  config: any;

  constructor(private snackBar: MatSnackBar, private translate: TranslateService, private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }

  showSnackbar(message: string, styleClass: string, durationMs: number) {
    this.snackBar.open(message, this.translate.instant('SNACKBAR.CONFIRM_BUTTON'), {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: [styleClass],
      duration: durationMs
    });
  }

  showEmailSnackbar() {
    return this.snackBar.open(this.translate.instant('LOGIN.ERRORS.EMAIL_NOT_VERIFIED'), this.translate.instant('SNACKBAR.RESEND_MAIL_BUTTON'), {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['warning-snackbar'],
      duration: this.config.SNACKBAR_ERROR_DURATION
    });
  }
}
