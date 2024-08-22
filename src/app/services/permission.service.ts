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

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.loadPermissions();
  }

  async ngOnInit() {
    await this.loadPermissions();
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
      }, []); // Start with an empty array
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      this.permissions = [];
    }
  }

  hasPermission(permission: string): boolean {
    return this.permissions.includes(permission);
  }

  get getPermissions(): string[] {
    console.log("Setting permissions...")
    return this.permissions;
  }
}
