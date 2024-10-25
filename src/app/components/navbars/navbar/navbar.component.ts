import {Component, ElementRef} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";
import {getAuth} from "firebase/auth";
import {PermissionService} from "../../../services/permission.service";
import {AuthService} from "../../../services/auth.service";
import {faBars, faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class Navbar {
  config: any;
  isMenuOpen: boolean = false;
  selectedTheme: 'light' | 'dark' | 'system' = 'light'; // Default theme
  dropdownThemeOpen = false;
  dropdownLanguageOpen = false;

  constructor(
    private authService: AuthService,
    public translate: TranslateService,
    private eRef: ElementRef,
    configService: ConfigService,
    protected permissionService: PermissionService
  ) {
    this.config = configService.getConfig();
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


  protected readonly getAuth = getAuth;
  protected readonly faXmark = faXmark;
  protected readonly faBars = faBars;
}
