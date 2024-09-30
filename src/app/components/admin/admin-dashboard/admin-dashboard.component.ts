import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../../services/config.service";
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'admin-dashboard-component',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
  animations: [
    trigger('slideText', [
      state('visible', style({transform: 'translateY(0%)'})),
      state('hidden25', style({transform: 'translateY(-25%)'})),
      state('hidden50', style({transform: 'translateY(-50%)'})),
      state('hidden75', style({transform: 'translateY(-75%)'})),
      transition('* => hidden25', [animate('0.3s ease')]),
      transition('* => hidden50', [animate('0.3s ease')]),
      transition('* => hidden75', [animate('0.3s ease')]),
      transition('* => visible', [animate('0s')])
    ])
  ]
})
export class AdminDashboardComponent implements OnInit {
  config: any;
  keywords = ['Java', 'AngularJS', 'Typescript']; // Keywords to type
  // colors = ['text-red-500', 'text-blue-500', 'text-green-500']; // Tailwind classes for colors
  colors = ['blue', 'green', 'red'];
  currentWordIndex = 0;
  displayText = '';
  isDeleting = false;
  typingSpeed = 150;
  deletingSpeed = 100;
  currentColor = this.colors[0];

  ngOnInit() {
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
          this.startTyping();
        }, 500);
        return;
      }
    }

    const delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;
    setTimeout(() => this.startTyping(), delay);
  }

  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }
}
