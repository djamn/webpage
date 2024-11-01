import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map, take, tap} from 'rxjs/operators';
import {AuthService} from "../services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(readonly auth: AuthService, readonly router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.getUserRoles().pipe(
      take(1),
      map(roles => roles.includes('admin')),
      tap(isAdmin => {
        if (!isAdmin) {
          this.router.navigate(['/']); // TODO can be changed later
        }
      })
    );
  }
}
