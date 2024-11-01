import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {combineLatest, map, Observable, of, shareReplay, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private userPermissions$: Observable<string[]>;

  constructor(readonly firestore: AngularFirestore, readonly authService: AuthService) {
    this.userPermissions$ = this.initUserPermissions();
  }

  private initUserPermissions(): Observable<string[]> {
    return this.authService.getUserRoles().pipe(
      switchMap(roles => this.getPermissionsForRoles(roles)),
      shareReplay(1)
    );
  }

  private getPermissionsForRoles(roles: string[]): Observable<string[]> {
    if (roles.length === 0) {
      return of([]);
    }

    const roleObservables = roles.map(role =>
      this.firestore.doc(`roles/${role}`).valueChanges()
    );

    return combineLatest(roleObservables).pipe(
      map(roleDocuments => {
        const allPermissions = roleDocuments.flatMap((doc: any) => doc?.permissions || []);
        return [...new Set(allPermissions)]; // Remove duplicates
      })
    );
  }

  hasPermission(permission: string): Observable<boolean> {
    return this.userPermissions$.pipe(
      map(permissions => permissions.includes(permission))
    );
  }

  getAllPermissions(): Observable<string[]> {
    return this.userPermissions$.pipe(
      map(permissions => Array.from(permissions))
    );
  }
}
