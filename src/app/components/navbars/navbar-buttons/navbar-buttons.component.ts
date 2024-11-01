import {Component, ElementRef, HostListener} from '@angular/core';
import {faDesktop, faMoon, faSignOut, faUser} from "@fortawesome/free-solid-svg-icons";
import {Language} from "../../../types/language.type";
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";
import {PermissionService} from "../../../services/permission.service";
import {getAuth} from "firebase/auth";
import {AuthService} from "../../../services/auth.service";

type Theme = 'light' | 'dark' | 'system';

@Component({
  selector: 'navbar-buttons',
  templateUrl: './navbar-buttons.component.html',
  styleUrl: './navbar-buttons.component.css'
})
export class NavbarButtonsComponent {
  config: any;
  selectedTheme: Theme = 'light'; // Default theme
  dropdownThemeOpen = false;
  dropdownLanguageOpen = false;
  dropdownAccountOpen = false;
  username: string | undefined = '';

  constructor(
    public translate: TranslateService,
    readonly eRef: ElementRef,
    readonly authService: AuthService,
    readonly configService: ConfigService,
    protected permissionService: PermissionService) {
    this.config = configService.getConfig();

    this.authService.user$.subscribe((user) => {
      this.username = user?.username;
    });

    // Load the saved theme from localStorage or set to system by default
    const savedTheme = window.localStorage.getItem('SELECTED_THEME') as Theme;
    this.selectedTheme = savedTheme ? savedTheme : 'light'; // Select default theme if no theme is selected

    // Apply the theme on initial load
    this.applyTheme(this.selectedTheme);

    // Add a listener to handle changes in system theme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', this.handleSystemThemeChange.bind(this));
  }


  selectLanguage(event: any) {
    const langCode = event.target.getAttribute('data-lang-code');
    console.debug("Setting new language: ", langCode);
    this.translate.use(langCode);
    window.localStorage.setItem('SELECTED_LANGUAGE', langCode);
    this.dropdownLanguageOpen = false;
  }

  getAvatarByCode(langCode: string): string | null {
    if (this.config && Array.isArray(this.config.LANGUAGES)) {
      const language = this.config.LANGUAGES.find((lang: Language) => lang.code === langCode);
      return language ? language.icon : null;
    }
    return null;
  }

  toggleThemeDropdown() {
    this.dropdownThemeOpen = !this.dropdownThemeOpen;
    this.dropdownLanguageOpen &&= false;
    this.dropdownAccountOpen &&= false;
  }

  toggleLanguageDropdown() {
    this.dropdownLanguageOpen = !this.dropdownLanguageOpen;
    this.dropdownThemeOpen &&= false;
    this.dropdownAccountOpen &&= false;
  }

  handleAccountClick() {
    this.dropdownAccountOpen = !this.dropdownAccountOpen;
    this.dropdownThemeOpen &&= false;
    this.dropdownLanguageOpen &&= false;
  }

  async logout() {
    await this.authService.logout();
  }

  selectTheme(theme: Theme) {
    this.selectedTheme = theme;
    this.dropdownThemeOpen = false;

    window.localStorage.setItem('SELECTED_THEME', theme);

    this.applyTheme(theme);
  }

  applyTheme(theme: Theme) {
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
    if (this.dropdownThemeOpen && !this.eRef.nativeElement.contains(event.target)) this.dropdownThemeOpen = false;
    else if (this.dropdownLanguageOpen && !this.eRef.nativeElement.contains(event.target)) this.dropdownLanguageOpen = false;
    else if (this.dropdownAccountOpen && !this.eRef.nativeElement.contains(event.target)) this.dropdownAccountOpen = false;
  }

  protected readonly faDesktop = faDesktop;
  protected readonly faMoon = faMoon;
  protected readonly getAuth = getAuth;
  protected readonly faSignOut = faSignOut;
  protected readonly faUser = faUser;
}
