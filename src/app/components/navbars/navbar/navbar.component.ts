import {Component, Input} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";
import {Language} from "../../../types/language.type";

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

  config: any;

/*  languages = [
    {code: 'en', name: 'English', avatar: '/assets/i18n/en_US.svg'},
    {code: 'de', name: 'German', avatar: '/assets/i18n/de_DE.svg'}
  ];*/

  constructor(public translate: TranslateService, private configService: ConfigService) {
    this.config = configService.getConfig();
  }

  onLanguageChange(langCode: any) {
    console.debug("Setting new language: ", langCode)
    this.translate.use(langCode.code);
    window.localStorage.setItem('SELECTED_LANGUAGE', langCode.code);
  }

  getAvatarByCode(langCode: string): string | null {
    if (this.config && Array.isArray(this.config.LANGUAGES)) {
      const language = this.config.LANGUAGES.find((lang: Language) => lang.code === langCode);
      return language ? language.icon : null;
    }
    return null;
  }

  /*
  * Todo Better Array Handling 2x definition
  * */

}
