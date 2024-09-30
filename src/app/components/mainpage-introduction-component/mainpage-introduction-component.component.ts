import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'mainpage-introduction-component',
  templateUrl: './mainpage-introduction-component.component.html',
  styleUrl: './mainpage-introduction-component.component.css'
})
export class MainPageIntroductionComponent implements OnInit {
  config: any;
  keywords = ['Java ', 'AngularJS ', 'Typescript ']; // Keywords to type
  // colors = ['text-red-500', 'text-blue-500', 'text-green-500']; // Tailwind classes for colors
  colors = ['blue', 'green', 'red'];
  currentWordIndex = 0;
  displayText = '';
  isDeleting = false;
  typingSpeed = 150;
  deletingSpeed = 100;
  currentColor = this.colors[0];

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => this.startTyping());
    this.startTyping();
  }

  startTyping() {
    const currentWord = this.keywords[this.currentWordIndex];
    const currentLength = this.displayText.length;

    if (this.isDeleting) {
      this.displayText = currentWord.substring(0, currentLength - 1);
      if (this.displayText === '') {
        this.isDeleting = false;
        this.currentWordIndex = (this.currentWordIndex + 1) % this.keywords.length;
        this.currentColor = this.colors[this.currentWordIndex]; // Change color
        console.log(this.currentColor);
      }
    } else {
      this.displayText = currentWord.substring(0, currentLength + 1);
      if (this.displayText === currentWord) {
        setTimeout(() => {
          this.isDeleting = true;
          this.ngZone.runOutsideAngular(() => this.startTyping());
        }, 500);
        return;
      }
    }

    const delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    this.cdr.detectChanges();

    setTimeout(() => this.ngZone.runOutsideAngular(() => this.startTyping()), delay);
  }

  constructor(private configService: ConfigService, private cdr : ChangeDetectorRef, private ngZone: NgZone) {
    this.config = this.configService.getConfig();
  }
}
