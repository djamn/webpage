import {Component, Input} from '@angular/core';
import build from "../../../../build";
import {PermissionService} from "../../../services/permission.service";

@Component({
  selector: 'projects-main-component',
  templateUrl: './projects-main-component.component.html',
  styleUrl: './projects-main-component.component.css'
})
export class ProjectsMainComponent {
  loading: boolean = false;
  @Input()
  projects: any[] = ['Hallo', 'h', 's', 's']


  constructor(protected permissionService: PermissionService) {
  }

  addProject(): void {

  }


  protected readonly build = build;
}
