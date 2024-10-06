import {Component} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faCat} from '@fortawesome/free-solid-svg-icons'
import {Snackbar} from "../../utility/snackbar";
import {CheckerService} from "./checker.service";
import {CatChecker} from "./checker.type";

@Component({
  selector: 'cat-check-component',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './cat-check-component.component.html',
  styleUrl: './cat-check-component.component.css'
})
export class CatCheckComponent {
  faCat = faCat
  feedingSessions: CatChecker[] = [];
  feedingCount: number = 0;
  feedsToday: number = 0;
  feedsYesterday: number = 0;
  lastFeedingSession: string = 'Unbekannt'

  constructor(private snackbar: Snackbar, private checker: CheckerService) {
    this.fetchFeedingSessions();
  }

  fetchFeedingSessions(): void {
    this.checker.getFeedingSessions().subscribe({
      next: (data) => {
        this.feedingSessions = data;
        this.feedingCount = this.feedingSessions.length;
        this.getLastFeedingSession();
        this.fetchTodaysFeedingSessions();
        this.fetchYesterdaysFeedingSessions();
        this.fetchDailyAverage();
      },
      error: (err) => {
        console.error('Error fetching feeding sessions:', err);
      }
    })
  }

  getLastFeedingSession() {
    this.lastFeedingSession = this.processTimestamp(this.feedingSessions[0].timestamp)
  }

  // TODO utility function
  processTimestamp(timestamp: any) {
    const date = new Date(timestamp)
    const formattedDate = date.toLocaleDateString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate} (${hours}:${minutes})`
  }

  fetchTodaysFeedingSessions() {
    const sessionsToday = this.feedingSessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return sessionDate >= this.getMidnightDate();
    });

    this.feedsToday = sessionsToday.length;
  }

  fetchYesterdaysFeedingSessions() {
    const todayDate = this.getMidnightDate();

    const startOfYesterday = new Date(todayDate);
    startOfYesterday.setDate(todayDate.getDate() - 1); // Move one day back

    const endOfYesterday = new Date(todayDate);
    endOfYesterday.setMilliseconds(-1); // One millisecond before today's midnight

    const sessionsYesterday = this.feedingSessions.filter(session => {
      const sessionDate = new Date(session.timestamp);
      return sessionDate >= startOfYesterday && sessionDate <= endOfYesterday;
    });

    this.feedsYesterday = sessionsYesterday.length;
  }

  getMidnightDate(): Date {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  fetchDailyAverage() {

  }


  feedCat() {

  }
}
