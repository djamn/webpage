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
  projects: any[] = [{
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
    project_entry_creation_timestamp: 238572922
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
      project_entry_creation_timestamp: 238572922
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
      project_entry_creation_timestamp: 238572922
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
      project_entry_creation_timestamp: 238572922
    }

  ]


  constructor(protected permissionService: PermissionService) {
  }

  addProject(): void {

  }


  protected readonly build = build;
}
