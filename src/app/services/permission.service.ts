import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import {firstValueFrom} from "rxjs";
import {PermissionsType} from "../types/permissions.type";

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private permissions: string[] = [];

  constructor(private firestore: AngularFirestore, private authService: AuthService) {
    this.loadPermissions();
  }

  // TODO userroles array
  private async loadPermissions(): Promise<void> { // Assuming permissions is a string array
    try {
      const role = await firstValueFrom(this.authService.getUserRole()); // Resolve the Observable to a string | null

      const roleDoc = await firstValueFrom(
        this.firestore.collection('roles').doc<PermissionsType>(role).get() // Use the RoleData interface here
      );

      this.permissions = roleDoc.exists ? (roleDoc.data()?.permissions || []) : [];
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      this.permissions = [];
    }
  }

  hasPermission(permission: string) : boolean {
    return this.permissions.includes(permission);
  }
}
