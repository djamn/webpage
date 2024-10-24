import {Component, ElementRef, HostListener} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";
import {Language} from "../../../types/language.type";
import {getAuth} from "firebase/auth";
import {PermissionService} from "../../../services/permission.service";
import {AuthService} from "../../../services/auth.service";
import {faAngleDown, faBars, faDesktop, faMoon, faSun, faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class Navbar {
  config: any;
  isMenuOpen: boolean = false;

  selectedTheme: 'light' | 'dark' | 'system' = 'light'; // Default theme
  dropdownOpen = false

  constructor(private authService: AuthService,
              public translate: TranslateService,
              private eRef: ElementRef,
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

  toggleThemeDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Change theme and close dropdown
  selectTheme(theme: 'light' | 'dark' | 'system') {
    this.selectedTheme = theme;
    this.dropdownOpen = false;

    // Apply the selected theme
    this.applyTheme(theme);
  }

  // Function to actually apply the theme (you can implement the logic here)
  applyTheme(theme: 'light' | 'dark' | 'system') {
    if (theme === 'light') {
      document.body.classList.remove('dark');
    } else if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      // You can implement system preference logic here
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }

  // Close dropdown if clicked outside of it
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.dropdownOpen && !this.eRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }


  protected readonly getAuth = getAuth;
  protected readonly faAngleDown = faAngleDown;
  protected readonly faXmark = faXmark;
  protected readonly faBars = faBars;
  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;
  protected readonly faDesktop = faDesktop;
}
