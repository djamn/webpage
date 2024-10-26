import {Component, ElementRef, OnInit} from '@angular/core'
import {TranslateService} from "@ngx-translate/core";
import {ConfigService} from "../../../services/config.service";
import {PermissionService} from "../../../services/permission.service";
import {AuthService} from "../../../services/auth.service";
import {faBars, faXmark} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css'],
})
export class Navbar implements OnInit {
  config: any;
  isMenuOpen: boolean = false;
  isLoggedIn = false;
  loading = true;

  constructor(
    private authService: AuthService,
    public translate: TranslateService,
    configService: ConfigService,
    protected permissionService: PermissionService
  ) {
    this.config = configService.getConfig();
  }

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.loading = false;
    });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  protected readonly faXmark = faXmark;
  protected readonly faBars = faBars;
}
