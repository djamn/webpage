import {Component, ElementRef, HostListener} from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {PermissionService} from "../../../services/permission.service";
import {combineLatest, of} from "rxjs";
import {map} from "rxjs/operators";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'navbar-links',
  templateUrl: './navbar-links.component.html',
  styleUrl: './navbar-links.component.css'
})
export class NavbarLinksComponent {
  dropdownOpen = false;
  config: any;

  hasAccessToServices$;

  constructor(readonly configService: ConfigService,
              readonly eRef: ElementRef,
              public translate: TranslateService,
              protected permissionService: PermissionService) {
    this.config = this.configService.getConfig();
    this.hasAccessToServices$ = this.checkUserAccess();
  }

  checkUserAccess() {
    const links: any[] = this.config.SERVICE_LINKS;

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
