import {Component, ElementRef, HostListener} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {TranslateService} from "@ngx-translate/core";
import {PermissionService} from "../../../services/permission.service";
import {combineLatest, of} from "rxjs";
import {map} from "rxjs/operators";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'navbar-links',
  templateUrl: './navbar-links.component.html',
  styleUrl: './navbar-links.component.css'
})
export class NavbarLinksComponent {
  generalLinks: any[] = [];
  serviceLinks: any[] = [];
  dropdownOpen = false;

  hasAccessToServices$ = this.checkUserAccess();

  constructor(private authService: AuthService,
              private eRef: ElementRef,
              public translate: TranslateService,
              protected permissionService: PermissionService) {
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
      ...this.generalLinks
    ];
  }

  getServiceLinks() {
    return [
      {
        label: this.translate.instant('NAVBAR.MANAGE_USERS_LINK_TITLE'),
        path: '/',
        permission: 'manage-users',
      },
      {
        label: this.translate.instant('Manage my whole live'),
        path: '/',
        permission: 'manage-users',
      },
      {
        label: this.translate.instant('NAVBAR._CAT_CHECKER_TITLE'),
        path: '/cat-checker',
        permission: 'view-cat-checker',
      },
      ...this.serviceLinks
    ]
  }

  checkUserAccess() {
    const links = this.getServiceLinks();

    // Convert each permission check into an observable
    const permissionChecks$ = links.map(link => !link.permission ? of(true) : this.permissionService.hasPermission(link.permission));

    return combineLatest(permissionChecks$).pipe(
      // If at least one permission check returns true, return true
      map(results => results.some(access => access === true))
    );
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Close dropdown if clicked outside of it
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.dropdownOpen && !this.eRef.nativeElement.contains(event.target)) this.dropdownOpen = false;
  }


  protected readonly faAngleDown = faAngleDown;
}
