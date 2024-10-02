import {Component} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";
import {Language} from "../../../types/language.type";
import {getAuth} from "firebase/auth";
import {PermissionService} from "../../../services/permission.service";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class Navbar {
  config: any;
  isMenuOpen: boolean = false;

  generalLinks: any[] = [];

  constructor(private authService: AuthService,
              public translate: TranslateService,
              private configService: ConfigService,
              protected permissionService: PermissionService) {
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

  async logout() {
    await this.authService.logout();
  }

  // TODO move to config
  getNavLinks() {
    return [
      {
        label: this.translate.instant('NAVBAR.DASHBOARD_LINK_TITLE'),
        path: '/dashboard',
        permission: 'view-admin-dashboard',
      },
      {
        label: this.translate.instant('NAVBAR.MAIN_PAGE_LINK_TITLE'),
        path: '/',
      },
      {
        label: this.translate.instant('NAVBAR.PROJECTS_LINK_TITLE'),
        path: '/projects',
      },
      {
        label: this.translate.instant('NAVBAR.MARIO_GAME_LINK_TITLE'),
        path: '/',
      },
      {
        label: this.translate.instant('NAVBAR.ABOUT_LINK_TITLE'),
        path: '/',
      },
      {
        label: this.translate.instant('NAVBAR.CHANGELOG_LINK_TITLE'),
        path: '/changelog',
      },
      {
        label: this.translate.instant('NAVBAR.MANAGE_USERS_LINK_TITLE'),
        path: '/',
        permission: 'manage-users',
      },
      ...this.generalLinks
    ];
  }

  protected readonly getAuth = getAuth;
}
