import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {catchError, firstValueFrom, of} from 'rxjs';
import {take} from 'rxjs/operators';
import {AuthService} from "../services/auth.service";
import {PermissionService} from "../services/permission.service";

@Injectable({
  providedIn: 'root'
})
export class DashboardGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router, private permissionService: PermissionService) {
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
