import {Component, ElementRef, HostListener} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";
import {Language} from "../../../types/language.type";
import {getAuth} from "firebase/auth";
import {PermissionService} from "../../../services/permission.service";
import {AuthService} from "../../../services/auth.service";
import {faBars, faDesktop, faMoon, faSun, faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class Navbar {
  config: any;
  isMenuOpen: boolean = false;
  selectedTheme: 'light' | 'dark' | 'system' = 'light'; // Default theme
  dropdownOpen = false;

  constructor(
    private authService: AuthService,
    public translate: TranslateService,
    private eRef: ElementRef,
    configService: ConfigService,
    protected permissionService: PermissionService
  ) {
    this.config = configService.getConfig();

    // Load the saved theme from localStorage or set to system by default
    const savedTheme = window.localStorage.getItem('SELECTED_THEME') as 'light' | 'dark' | 'system';
    this.selectedTheme = savedTheme ? savedTheme : 'system';

    // Apply the theme on initial load
    this.applyTheme(this.selectedTheme);

    // Add a listener to handle changes in system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
  }

  onLanguageChange(langCode: any) {
    console.debug("Setting new language: ", langCode);
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

    window.localStorage.setItem('SELECTED_THEME', theme);

    this.applyTheme(theme);
  }

  // Apply the theme
  applyTheme(theme: 'light' | 'dark' | 'system') {
    switch (theme) {
      case 'light':
        document.body.classList.remove('dark');
        break;
      case 'dark':
        document.body.classList.add('dark');
        break;
      default:
        this.applySystemTheme();
    }
  }

  // Handle applying the system theme
  applySystemTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    prefersDark ? document.body.classList.add('dark') : document.body.classList.remove('dark');
  }

  // Handle changes in the system theme preference
  handleSystemThemeChange(event: MediaQueryListEvent) {
    if (this.selectedTheme === 'system') {
      event.matches ? document.body.classList.add('dark') : document.body.classList.remove('dark');
    }
  }

  // Close dropdown if clicked outside of it
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.dropdownOpen && !this.eRef.nativeElement.contains(event.target)) this.dropdownOpen = false;
  }

  protected readonly getAuth = getAuth;
  protected readonly faXmark = faXmark;
  protected readonly faBars = faBars;
  protected readonly faSun = faSun;
  protected readonly faMoon = faMoon;
  protected readonly faDesktop = faDesktop;
}
