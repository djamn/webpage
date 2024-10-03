import {Component} from '@angular/core';
import build from "../../../../build";
import {PermissionService} from "../../../services/permission.service";
import {ProjectsService} from "../../../services/projects.service";
import {TranslateService} from "@ngx-translate/core";
import {Project} from "../../../types/projects.type";

@Component({
  selector: 'projects-main-component',
  templateUrl: './projects-main-component.component.html',
  styleUrl: './projects-main-component.component.css'
})
export class ProjectsMainComponent {
  loading: boolean = false;
  featuredCount: number = 0;
  projects: Project[] = [{
    id: 'bla',
    title: 'Bike Management System',
    subpage_url: '/changelog',
    short_desc: 'short desc',
    long_desc: 'longer longer longer desc',
    repo_url: 'REPO URL',
    external_url: 'EXT URL',
    image_url: 'IMG URL',
    tags: ['tag1', 'tag2'],
    is_featured: false,
    year_created: 2024,
    likes: 10,
    project_entry_creation_timestamp: 238572922,
    views: 0,
  },
    {
      id: 'bla',
      title: 'Bike Management System',
      subpage_url: '/changelog',
      short_desc: 'System to manage some cool bikes in my garden',
      long_desc: 'System to manage some cool bikes in my garden',
      repo_url: 'REPO URL',
      external_url: 'EXT URL',
      image_url: 'IMG URL',
      tags: ['tag1', 'tag2'],
      is_featured: false,
      year_created: 2024,
      likes: 100,
      project_entry_creation_timestamp: 238572922,
      views: 0,
    },
    {
      id: 'bla',
      title: 'Bike Management System',
      subpage_url: '/changelog',
      short_desc: 'short desc',
      long_desc: 'longer longer longer desc',
      repo_url: 'REPO URL',
      external_url: 'EXT URL',
      image_url: 'IMG URL',
      tags: ['tag1', 'tag2'],
      is_featured: false,
      year_created: 2024,
      likes: 20,
      project_entry_creation_timestamp: 238572922,
      views: 0,
    },
    {
      id: 'bla',
      title: 'Bike Management System',
      subpage_url: '/changelog',
      short_desc: 'short desc',
      long_desc: 'longer longer longer desc',
      repo_url: 'REPO URL',
      external_url: 'EXT URL',
      image_url: 'IMG URL',
      tags: ['tag1', 'tag2'],
      is_featured: false,
      year_created: 2024,
      likes: 150,
      project_entry_creation_timestamp: 238572922,
      views: 0,
    }

  ]


  constructor(protected permissionService: PermissionService, private projectService: ProjectsService, private translate: TranslateService) {
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

  addProject(): void {

  }


  protected readonly build = build;
}
