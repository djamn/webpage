import {Component} from '@angular/core';
import {PermissionService} from "../../../services/permission.service";
import {ProjectsService} from "../../../services/projects.service";
import {Project} from "../../../types/projects.type";
import {firstValueFrom} from "rxjs";
import {PopupService} from "../../../services/popup.service";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'projects-main-component',
  templateUrl: './projects-main-component.component.html',
  styleUrl: './projects-main-component.component.css'
})
export class ProjectsMainComponent {
  loading: boolean = false;
  featuredCount: number = 0;
  likedProjectsId: string[] = []
  projects: Project[] = [{
    id: 'bla',
    title: 'Bike Management System',
    sub_page_url: '/projects',
    short_desc: 'System to manage some cool bikes in my garden',
    long_desc: 'System to manage some cool bikes in my garden',
    repo_url: 'REPO URL',
    external_url: 'EXT URL',
    image_url: '/assets/no-image.svg',
    tags: ['tag1', 'tag2'],
    is_featured: false,
    project_year: 2024,
    likes: 100,
    entry_created_at: 238572922,
    views: 0,
    entry_last_updated_at: 0,
  },
    {
      id: 'bla',
      title: 'Bike Management System',
      sub_page_url: '/projects',
      short_desc: 'System to manage some cool bikes in my garden',
      long_desc: 'System to manage some cool bikes in my garden',
      repo_url: 'REPO URL',
      external_url: 'EXT URL',
      image_url: '/assets/no-image.svg',
      tags: ['tag1', 'tag2'],
      is_featured: false,
      project_year: 2024,
      likes: 100,
      entry_created_at: 238572922,
      views: 0,
      entry_last_updated_at: 0,
    },
    {
      id: 'bla',
      title: 'Bike Management System',
      sub_page_url: '/projects',
      short_desc: 'System to manage some cool bikes in my garden',
      long_desc: 'System to manage some cool bikes in my garden',
      repo_url: 'REPO URL',
      external_url: 'EXT URL',
      image_url: '/assets/no-image.svg',
      tags: ['tag1', 'tag2'],
      is_featured: false,
      project_year: 2024,
      likes: 100,
      entry_created_at: 238572922,
      views: 0,
      entry_last_updated_at: 0,
    },
  ]

  constructor(protected permissionService: PermissionService,
              readonly projectService: ProjectsService,
              readonly popupService: PopupService) {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;

    this.projectService.getProjects().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
        this.featuredCount = this.projects.filter(project => project.is_featured).length;
      },
      error: (err) => {
        console.error('Error fetching projects:', err);
        this.loading = false;
      }
    })
  }

  async addProject() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-projects'));

    if (hasPermission) {
      this.popupService.openCreateProjectPopup(this.featuredCount);
    }
  }

  protected readonly faPlus = faPlus;
}
