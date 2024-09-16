import {Component, OnInit} from '@angular/core';
import {ChangelogService} from "../../services/changelog.service";
import {PermissionService} from "../../services/permission.service";
import {ChangelogEntry} from "../../types/changelog.entry.type";
import {firstValueFrom} from "rxjs";
import {PopupService} from "../../services/popup.service";
import {TranslateService} from "@ngx-translate/core";
import {Snackbar} from "../../utility/snackbar";
import {ConfigService} from "../../services/config.service";

@Component({
  selector: 'changelog-component',
  templateUrl: './changelog.component.html',
  styleUrl: './changelog.component.css'
})
export class ChangelogComponent implements OnInit {
  loading: boolean = true;
  config: any;

  changelog: ChangelogEntry[] = [
    {
      changes: [
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitir elitir elitir elitir elitir elitir elitir elitir elitir elitir',
        'Lorem ipsum dolor sit amet, consetetur',
        'Lorem ipsum dolor sit amet, consetetur sadipscing'
      ],
      id: 'uid',
      version: '1.0.0',
      version_category: 'general',
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
      version_category: 'general',
      timestamp: 12222222,
    },
  ];

  constructor(private changelogService: ChangelogService,
              private popupService: PopupService,
              private translate: TranslateService,
              private snackbar: Snackbar,
              private configService: ConfigService,
              protected permissionService: PermissionService) {
  }

  ngOnInit() {
    this.config = this.configService.getConfig();
    this.fetchEntries();
  }

  fetchEntries() {
    this.loading = true;
    this.changelogService.getEntries().subscribe({
      next: (data) => {
        this.changelog = data;
        console.log(data)
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching changelog entries:', err);
        this.loading = false
      },
    })
  }

  async addEntry() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-changelog-entries'));
    if (hasPermission) {
      this.popupService.openCreateChangelogPopup().subscribe(async (result) => {
        if (result) {
          try {
            await this.changelogService.addEntry(result.timestamp, result.changes, result.version, result.version_category)
            this.snackbar.showSnackbar(this.translate.instant('CHANGELOG.CREATION_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
          } catch (err) {
            console.error("Error while creating changelog", err);
            this.snackbar.showSnackbar(this.translate.instant('CHANGELOG.CREATION_UNSUCCESSFUL'), 'error-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
          }
        }
      })
    }
  }

  // TODO snackbars auf success und error checken

  async deleteEntry(id: string) {
    console.log('works?')
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-changelog-entries'));

    if (hasPermission) {
      this.popupService.openPopup(this.translate.instant('DIALOG.DESCRIPTION_DELETE_CHANGELOG_ENTRY', {}), this.translate.instant('BUTTONS.BUTTON_DELETE')).subscribe(async (result) => {
        if (result) {
          try {
            await this.changelogService.deleteEntry(id);
            this.snackbar.showSnackbar(this.translate.instant('CHANGELOG.DELETION_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
          } catch (err) {
            console.error('Error deleting changelog entry:', err);
            this.snackbar.showSnackbar(this.translate.instant('CHANGELOG.DELETION_UNSUCCESSFUL'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          }
        }
      })
    }
  }

  async editEntry(entry: ChangelogEntry) {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-changelog-entries'));
    if (hasPermission) {
      this.popupService.openUpdateChangelogPopup(entry).subscribe(async (result) => {
        if (result) {
          try {
            await this.changelogService.updateEntry(entry.id, result.timestamp, result.changes, result.version, result.version_category)
            this.snackbar.showSnackbar(this.translate.instant('CHANGELOG.UPDATE_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
          } catch (err) {
            console.error('Error updating changelog entry:', err);
            this.snackbar.showSnackbar(this.translate.instant('CHANGELOG.UPDATE_UNSUCCESSFUL'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          }
        }
      })

    }
  }

  processTimestamp(timestamp: any) {
    const date = new Date(timestamp)
    const formattedDate = date.toLocaleDateString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${formattedDate}, ${hours}:${minutes}`
  }
}
