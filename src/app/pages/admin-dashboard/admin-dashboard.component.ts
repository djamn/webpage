import {Component} from '@angular/core';
import {ComponentsModule} from "../../components/components.module";

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [
    ComponentsModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboard {

}
