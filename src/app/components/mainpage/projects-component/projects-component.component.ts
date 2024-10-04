import {Component} from '@angular/core';
import {Project} from "../../../types/projects.type";
import {PermissionService} from "../../../services/permission.service";
import {ProjectsService} from "../../../services/projects.service";
import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {PopupService} from "../../../services/popup.service";

@Component({
  selector: 'projects-component',
  templateUrl: './projects-component.component.html',
  styleUrl: './projects-component.component.css'
})
export class ProjectsComponent {
  loading: boolean = false;

//   TODO Example entries
  projects: Project[] = [];
  projectsChunks: Project[][] = [];

  constructor(protected permissionService: PermissionService,
              private projectService: ProjectsService,
              private popupService: PopupService,
              private translate: TranslateService) {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.loading = true;

    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data.filter(project => project.is_featured);
        this.projectsChunks = this.chunkArray(this.projects, 2);
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.loading = false;
      }
    })
  }

  chunkArray(array: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }

  async addProject() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-projects'));

    if (hasPermission) {
      this.popupService.openCreateProjectPopup();
    }
  }

}
