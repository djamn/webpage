import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, firstValueFrom, of} from 'rxjs';
import {take} from 'rxjs/operators';
import {PermissionService} from "../services/permission.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(readonly router: Router, readonly permissionService: PermissionService) {
  }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('view-admin-dashboard').pipe(
      take(1),
      catchError(() => of(false)) // Handle errors gracefully
    ));

    if (hasPermission) return true;
    else {
      await this.router.navigate(['/login']); // Redirect if no permission
      return false;
    }
  }
}
