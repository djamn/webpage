import {Component, OnInit} from '@angular/core';
import {ConfigService} from "../../../services/config.service";
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'admin-dashboard-component',
  styleUrl: './admin-dashboard.component.css',
  template: `
    <div class="min-h-screen bg-white text-gray-800 p-8 flex flex-col justify-center items-center">
      <h1 class="text-4xl font-bold mb-6">David's Portfolio</h1>

      <p class="text-xl mb-8">
        I'm David, an experienced software developer with a strong focus on
        <span class="font-semibold text-blue-600" [@textChange]="currentSkill">
          {{ skills[currentSkillIndex] }}
        </span>
      </p>

      <a
        routerLink="/guestbook"
        class="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
      >
        Visit My Guestbook
      </a>
    </div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    :host {
      display: block;
      animation: fadeIn 0.5s ease-out;
    }
  `],
  animations: [
    trigger('textChange', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})

export class AdminDashboardComponent implements OnInit{
  config: any;
  skills: string[] = ['Java', 'Web Development', 'CSS'];
  currentSkillIndex = 0;
  currentSkill = '';

  constructor(private configService: ConfigService) {
    this.config = this.configService.getConfig();
  }

  ngOnInit() {
    this.rotateSkills();
  }

  rotateSkills() {
    setInterval(() => {
      this.currentSkillIndex = (this.currentSkillIndex + 1) % this.skills.length;
      this.currentSkill = this.skills[this.currentSkillIndex];
    }, 3000);
  }
}
