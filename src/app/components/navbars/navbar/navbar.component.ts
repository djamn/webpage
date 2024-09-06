import {Component, Input} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class Navbar {
  @Input()
  rootClassName: string = ''
  @Input()
  navbarLinkAbout: string = 'About'
  @Input()
  navbarLogoSrc: string = '/assets/logo_black-1500h.png'
  @Input()
  navbarButtonLogin: string = 'Login'
  @Input()
  navbarLinkBikeStations: string = 'Bike Stations'
  @Input()
  navbarButtonRegister: string = 'Register'

  languages = [
    {code: 'en', name: 'English', avatar: '/assets/i18n/en_US.svg'},
    {code: 'de', name: 'German', avatar: '/assets/i18n/de_DE.svg'}
  ];

  constructor(public translate: TranslateService) {
  }

  onLanguageChange(langCode: any) {
    console.debug("Setting new language: ", langCode)
    this.translate.use(langCode.code);
    window.localStorage.setItem('SELECTED_LANGUAGE', langCode.code);
  }

  getAvatarByCode(langCode: string) {
    const language = this.languages.find(lang => lang.code === langCode);
    return language ? language.avatar : null;
  }

  /*
  * Todo Better Array Handling 2x definition
  * */

}
