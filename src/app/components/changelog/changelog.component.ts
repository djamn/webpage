import {Component, OnInit} from '@angular/core';
import {ChangelogService} from "../../services/changelog.service";
import {PermissionService} from "../../services/permission.service";
import {ChangelogEntry} from "../../types/changelog.entry.type";

@Component({
  selector: 'changelog-component',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent implements OnInit {
  loading: boolean = true;

  constructor(private changelogService: ChangelogService,
              protected permissionService: PermissionService) {
  }

  ngOnInit() {
    this.fetchEntries();
  }

  fetchEntries() {
    this.loading = true;
    this.changelogService.getEntries().subscribe({
      next: (data) => {
        this.changelog = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching changelog entries:', err);
        this.loading = false
      },
    })
  }

  changelog: ChangelogEntry[] = [
    {
      changes: [
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitir elitir elitir elitir elitir elitir elitir elitir elitir elitir',
        'Lorem ipsum dolor sit amet, consetetur',
        'Lorem ipsum dolor sit amet, consetetur sadipscing'
      ],
      id: 'uid',
      version: '1.0.0',
      timestamp: 12222222,
    },
    {
      changes: [
        'At vero eos et accusam et justo duo dolores et ea rebum',
        'Lorem ipsum dolor sit amet',
        'Labore et dolore magna aliquyam erat, sed diam'
      ],
      id: 'uid',
      version: '2.0.0',
      timestamp: 12222222,
    },
  ];

  deleteEntry(id: string) {

  }

  editEntry(id: string) {

  }

  processTimestamp(timestamp: any) {
    const date = new Date(timestamp)
    const formattedDate = date.toLocaleDateString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate}, ${hours}:${minutes}`
  }
}
