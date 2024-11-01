import {Component, OnDestroy, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCat, faCheck, faTrashCan, faXmark} from '@fortawesome/free-solid-svg-icons'
import {Snackbar} from "../../utility/snackbar";
import {CheckerService} from "./checker.service";
import {CatChecker} from "./checker.type";
import {ConfigService} from "../../services/config.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'cat-check-component',
  standalone: true,
  imports: [FontAwesomeModule, NgIf],
  templateUrl: './cat-check-component.component.html',
  styleUrl: './cat-check-component.component.css'
})
export class CatCheckComponent implements OnInit, OnDestroy {
  feedingSessions: CatChecker[] = [];
  feedingCount: number = 0;
  feedsToday: number = -1;
  feedsYesterday: number = 0;
  lastFeedingSession: string = 'Unbekannt'
  config: any;
  feedingDone: boolean = false;
  feedingDeleted: boolean = false;
  isError: boolean = false;

  private timer: any;
  currentTime: string = '';

  isLastFeedingSession = false;

  constructor(
    readonly snackbar: Snackbar,
    readonly checker: CheckerService,
    readonly configService: ConfigService) {
    this.config = this.configService.getConfig();
    this.fetchFeedingSessions();
  }

  ngOnInit() {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 60000); // Update every minute
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  // TODO timestamp utility function
  updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    this.currentTime = `${hours}:${minutes}`;
  }

  fetchFeedingSessions(): void {
    this.checker.getFeedingSessions().subscribe({
      next: (data) => {
        if (data.length > 0) {
          console.log(data)
          this.feedingSessions = data;
          this.feedingCount = this.feedingSessions.length;
          this.getLastFeedingSession();
          this.fetchTodaysFeedingSessions();
          this.fetchYesterdaysFeedingSessions();
        } else {
          this.feedingSessions = []
          this.feedingCount = 0;
          this.feedsToday = 0;
          this.lastFeedingSession = 'Unbekannt'
          this.feedsYesterday = 0;
          console.log("No data available");
        }
      },
      error: (err) => {
        console.error('Error fetching feeding sessions:', err);
      }
    })
  }

  getLastFeedingSession() {
    this.lastFeedingSession = this.processTimestamp(this.feedingSessions[0].timestamp)
  }

  fetchTodaysFeedingSessions() {
    const todayDate = this.getMidnightDate();

    const sessionsToday = this.feedingSessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return this.isToday(sessionDate, todayDate);
    });

    this.feedsToday = sessionsToday.length;
  }


  fetchYesterdaysFeedingSessions() {
    const todayDate = this.getMidnightDate();

    const sessionsYesterday = this.feedingSessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return this.isYesterday(sessionDate, todayDate); // Reuse isYesterday() method
    });

    this.feedsYesterday = sessionsYesterday.length;
  }

  getMidnightDate(): Date {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  async deleteLastFeedingSession() {
    if (this.feedingSessions.length <= 0 || !this.isLastFeedingSession) return;

    try {
      await this.checker.deleteFeedingSession(this.feedingSessions[0].id);

      this.feedingDeleted = true;

      setTimeout(() => {
        this.feedingDeleted = false;
        this.isLastFeedingSession = false;
        console.debug("Feeding deletion session reset!");
      }, 2000);

    } catch (error) {
      console.error("Error deletion feeding session", error)
      this.snackbar.showSnackbar('Fehler beim Löschen der Fütterung - Admin kontaktieren!', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  async feedCat() {
    if (this.feedingDone) return;

    try {
      await this.checker.addFeedingSession(Date.now())
      this.isError = false;
      this.feedingDone = true;
      this.isLastFeedingSession = true;

      setTimeout(() => {
        this.feedingDone = false;
        console.debug("Feeding session reset!");
      }, 2000);
      console.debug("Feeding worked!")
    } catch (error) {
      console.error("Error adding feeding session", error)
      this.isError = true;
      this.snackbar.showSnackbar('Fehler beim Hinzufügen einer Fütterung - Admin kontaktieren!', 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
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


  protected readonly faCat = faCat;
  protected readonly faCheck = faCheck;
  protected readonly faXmark = faXmark;
  protected readonly faTrashCan = faTrashCan;
}
