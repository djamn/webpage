import {Injectable, OnInit} from '@angular/core';
import {AuthService} from "./auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {firstValueFrom} from "rxjs";
import {PermissionsType} from "../types/permissions.type";

@Injectable({
  providedIn: 'root'
})
export class PermissionService implements OnInit {
  private permissions: string[] = [];
  private permissionsLoaded: Promise<void>;

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.permissionsLoaded = this.loadPermissions();
  }

  async ngOnInit() {
    await this.permissionsLoaded;
  }

  private async loadPermissions(): Promise<void> {
    try {
      const roles = await firstValueFrom(this.authService.getUserRole());
      console.log("ROLES", roles);

      if (!roles || roles.length === 0) {
        this.permissions = [];
        return;
      }

      const permissionPromises = roles.map(role =>
        firstValueFrom(this.firestore.collection<PermissionsType>('roles').doc(role).get())
      );
      const roleDocs = await Promise.all(permissionPromises);

      this.permissions = roleDocs.reduce<string[]>((acc, doc) => {
        if (doc.exists) {
          const rolePermissions = doc.data()?.permissions || [];
          return acc.concat(rolePermissions);
        }
        return acc;
      }, []);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      this.permissions = [];
    }
  }

  async getPermissions(): Promise<string[]> {
    await this.permissionsLoaded;
    return this.permissions;
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }
}
