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
  config: any;
  isMenuOpen: boolean = false;

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

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Method to close the menu
  closeMenu(): void {
    this.isMenuOpen = false;
  }
}
