import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
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
export class AdminDashboardComponent implements AfterViewInit {
  config: any;
  @ViewChild('textContainer') textContainer!: ElementRef;
  texts = [
    {
      text: 'amazing',
      className:
        'bg-clip-text text-center text-transparent bg-gradient-to-r from-[#ff1835] to-[#ffc900]'
    },
    {
      text: 'stunning',
      className:
        'bg-clip-text text-center text-transparent bg-gradient-to-r from-[#0077ff] to-[#00e7df]'
    },
    {
      text: 'fantastic',
      className:
        'bg-clip-text text-center text-transparent bg-gradient-to-r from-[#7f00de] to-[#ff007f]'
    },
    {
      text: 'amazing',
      className:
        'bg-clip-text text-center text-transparent bg-gradient-to-r from-[#ff1835] to-[#ffc900]'
    }
  ];

  currentTextIndex = 0;
  currentState = 'visible';

  ngAfterViewInit() {
    this.animateTexts();
  }

  animateTexts() {
    setInterval(() => {
      this.currentState = 'hidden';

      setTimeout(() => {
        this.currentTextIndex =
          (this.currentTextIndex + 1) % this.texts.length;
        this.currentState = 'visible';
      }, 300); // 300ms delay matches animation duration
    }, 1600); // Time interval between changes
  }

  get currentText() {
    return this.texts[this.currentTextIndex];
  }

  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }

/*  animateTexts() {
    let step = 0;
    setInterval(() => {
      switch (step) {
        case 0:
          this.currentState = 'visible';
          break;
        case 1:
          this.currentState = 'hidden25';
          break;
        case 2:
          this.currentState = 'hidden50';
          break;
        case 3:
          this.currentState = 'hidden75';
          break;
      }
      step = (step + 1) % 4;
    }, 1600);
  }*/
}
