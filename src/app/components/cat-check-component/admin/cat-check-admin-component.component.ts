import {Component} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {NgIf} from "@angular/common";
import {CatChecker} from "../checker.type";
import {CheckerService} from "../checker.service";
import {ConfigService} from "../../../services/config.service";
import {Snackbar} from "../../../utility/snackbar";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {PopupService} from "../../../services/popup.service";

// TODO internationalisieren + aufräumen (utility funktionen)

@Component({
  selector: 'cat-check-admin-component',
  standalone: true,
  imports: [FontAwesomeModule, NgIf, ReactiveFormsModule, TranslateModule, FormsModule],
  templateUrl: './cat-check-admin-component.component.html',
  styleUrls: ['./cat-check-admin-component.component.css']
})
export class CatCheckAdminComponent {
  timestamp: number | null = null;
  feedingSessions: CatChecker[] = [];
  feedingCount: number = 0;
  feedsToday: number = -1;
  feedsYesterday: number = 0;
  lastFeedingSession: string = 'Unbekannt';
  feedsTodayFormatted: string = '';
  feedsYesterdayFormatted: string = '';
  config: any;

  constructor(
    readonly snackbar: Snackbar,
    readonly checker: CheckerService,
    readonly configService: ConfigService,
    readonly popupService: PopupService
  ) {
    this.config = this.configService.getConfig();
    this.fetchFeedingSessions();
  }

  async deleteFeedingSession() {
    if (!this.timestamp) {
      this.snackbar.showSnackbar('Enter a valid timestamp!', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    this.popupService.openPopup("Do you want to delete the specific timestamp?", "Delete").subscribe(async (result) => {
      if (result) {
        try {
          const session = this.feedingSessions.find(session => session.timestamp === this.timestamp);

          if (!session) {
            this.snackbar.showSnackbar(`No feeding session with timestamp ${this.timestamp} exists!`, 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
            return;
          }

          const id = session.id;
          await this.checker.deleteFeedingSession(id);
          this.timestamp = null;

          this.snackbar.showSnackbar('Successfully deleted feeding session!', 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        } catch (err) {
          this.snackbar.showSnackbar('There was an error deleting feeding session, check console.', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          console.error("Error deleting feeding session", err);
        }
      }
    });
  }

  fetchFeedingSessions(): void {
    this.checker.getFeedingSessions().subscribe({
      next: (data) => {
        if (data.length > 0) {
          console.log(data);
          this.feedingSessions = data;
          this.feedingCount = this.feedingSessions.length;
          this.getLastFeedingSession();
          this.fetchTodaysFeedingSessions();
          this.fetchYesterdaysFeedingSessions();
        } else {
          this.resetFeedingSessionData();
          console.log("No data available");
        }
      },
      error: (err) => {
        console.error('Error fetching feeding sessions:', err);
      }
    });
  }

  resetFeedingSessionData() {
    this.feedingSessions = [];
    this.feedingCount = 0;
    this.feedsToday = 0;
    this.lastFeedingSession = 'Unbekannt';
    this.feedsYesterday = 0;
    this.feedsTodayFormatted = '';
    this.feedsYesterdayFormatted = '';
  }

  getLastFeedingSession() {
    this.lastFeedingSession = this.processTimestamp(this.feedingSessions[0].timestamp);
  }

  fetchTodaysFeedingSessions() {
    const todayDate = this.getMidnightDate();
    const sessionsToday = this.feedingSessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return this.isToday(sessionDate, todayDate);
    });

    this.feedsToday = sessionsToday.length;
    this.feedsTodayFormatted = this.formatFeedingSessions(sessionsToday);
  }

  fetchYesterdaysFeedingSessions() {
    const todayDate = this.getMidnightDate();
    const sessionsYesterday = this.feedingSessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return this.isYesterday(sessionDate, todayDate);
    });

    this.feedsYesterday = sessionsYesterday.length;
    this.feedsYesterdayFormatted = this.formatFeedingSessions(sessionsYesterday);
  }

  formatFeedingSessions(sessions: CatChecker[]): string {
    return sessions.map(session => {
      const date = new Date(session.timestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes} (${session.timestamp})`;
    }).join(', ');
  }

  getMidnightDate(): Date {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  processTimestamp(timestamp: any) {
    const date = new Date(timestamp);
    const formattedDate = this.getFormattedDate(date);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} (${hours}:${minutes})`;
  }

  getFormattedDate(date: Date): string {
    const todayDate = this.getMidnightDate();

    if (this.isToday(date, todayDate)) {
      return 'Heute';
    } else if (this.isYesterday(date, todayDate)) {
      return 'Gestern';
    } else {
      return date.toLocaleDateString();
    }
  }

  isToday(date: Date, todayDate: Date): boolean {
    return date >= todayDate;
  }

  isYesterday(date: Date, todayDate: Date): boolean {
    const startOfYesterday = this.getStartOfYesterday(todayDate);
    const endOfYesterday = this.getEndOfYesterday(todayDate);
    return date >= startOfYesterday && date <= endOfYesterday;
  }

  getStartOfYesterday(todayDate: Date): Date {
    const startOfYesterday = new Date(todayDate);
    startOfYesterday.setDate(todayDate.getDate() - 1); // Move one day back
    return startOfYesterday;
  }

  getEndOfYesterday(todayDate: Date): Date {
    const endOfYesterday = new Date(todayDate);
    endOfYesterday.setMilliseconds(-1); // One millisecond before today's midnight
    return endOfYesterday;
  }

  protected readonly faTrashCan = faTrashCan;
}
