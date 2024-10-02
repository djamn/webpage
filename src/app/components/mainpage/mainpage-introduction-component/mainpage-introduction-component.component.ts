import {ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'mainpage-introduction-component',
  templateUrl: './mainpage-introduction-component.component.html',
  styleUrl: './mainpage-introduction-component.component.css'
})
export class MainPageIntroductionComponent implements OnInit, OnDestroy {
  config: any;
  keywords: string[];
  colors: string[];
  currentWordIndex: number = 0;
  displayText: string = '';
  isDeleting: boolean = false;
  typingSpeed: number;
  deletingSpeed: number;
  currentColor: string;
  active: boolean = false;

  constructor(private configService: ConfigService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.config = this.configService.getConfig();
    this.keywords = this.config.KEYWORDS_LANDING_PAGE;
    this.colors = this.config.KEYWORDS_COLOR_LIST;
    this.deletingSpeed = this.config.DELETING_SPEED_MS;
    this.typingSpeed = this.config.TYPING_SPEED_MS;
    this.currentColor = this.colors[0];
  }

  ngOnInit() {
    this.active = true;
    this.ngZone.runOutsideAngular(() => this.startTyping());
  }

  ngOnDestroy() {
    this.active = false;
  }

  startTyping() {
    if (!this.active) return;
    const currentWord = this.keywords[this.currentWordIndex];
    const currentLength = this.displayText.length;

    if (this.isDeleting) {
      this.displayText = currentWord.substring(0, currentLength - 1);
      if (this.displayText === '') {
        this.isDeleting = false;
        this.currentWordIndex = (this.currentWordIndex + 1) % this.keywords.length;
        this.currentColor = this.colors[this.currentWordIndex];
      }
    } else {
      this.displayText = currentWord.substring(0, currentLength + 1);
      if (this.displayText === currentWord) {
        setTimeout(() => {
          this.isDeleting = true;
          this.ngZone.runOutsideAngular(() => this.startTyping());
        }, this.config.FULL_KEYWORD_PAUSE_DURATION_MS);
        return;
      }
    }

    this.cdr.detectChanges(); // Needed otherwise it will not be executed
    const delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
    setTimeout(() => this.ngZone.runOutsideAngular(() => this.startTyping()), delay);
  }
}
