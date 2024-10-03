import {Component, Input} from '@angular/core';
import {Project} from "../../../types/projects.type";
import {PermissionService} from "../../../services/permission.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'project-template',
  templateUrl: './project-template.component.html',
  styleUrl: './project-template.component.css'
})
export class ProjectTemplateComponent {
  @Input()
  project!: Project;

  constructor(permissionService: PermissionService, translate: TranslateService) {

  }
}
