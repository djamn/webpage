import {Component, ElementRef, OnInit} from '@angular/core'
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
export class Navbar implements OnInit{
  config: any;
  isMenuOpen: boolean = false;
  isLoggedIn = false;
  loading = true;

  constructor(
    private authService: AuthService,
    public translate: TranslateService,
    private eRef: ElementRef,
    configService: ConfigService,
    protected auth : AuthService,
    protected permissionService: PermissionService
  ) {
    this.config = configService.getConfig();
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.loading = false; // Loading is done once we have the login state
    });
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

  protected readonly faXmark = faXmark;
  protected readonly faBars = faBars;
}
