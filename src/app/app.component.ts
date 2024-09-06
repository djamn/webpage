import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {TranslateModule, TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

// TODO move service in mainpage
export class AppComponent {
  constructor(public translate: TranslateService) {
    translate.setDefaultLang('en');

    const storedLanguage = window.localStorage.getItem('SELECTED_LANGUAGE');
    console.debug("Stored Language: " + storedLanguage)
    if (storedLanguage) translate.use(storedLanguage);
    else {
      console.debug("No stored language, using default")
      const browserLang = translate.getBrowserLang();
      const lang = browserLang!.match(/en|de/) ? browserLang : 'en'
      if (lang) translate.use(lang);
      else translate.use('en');
    }
  }

  title = 'web-frontend';
}
