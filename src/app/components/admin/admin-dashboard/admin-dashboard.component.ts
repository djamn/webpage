import {Component} from '@angular/core';
import {PermissionService} from "../../../services/permission.service";

@Component({
  selector: 'admin-dashboard-component',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})

export class AdminDashboardComponent {

  constructor(protected permissionService : PermissionService) {
  }

}
