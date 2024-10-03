import {Component, Input} from '@angular/core';
import {Project} from "../../../types/projects.type";
import {PermissionService} from "../../../services/permission.service";
import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {ProjectsService} from "../../../services/projects.service";
import {Snackbar} from "../../../utility/snackbar";
import {ConfigService} from "../../../services/config.service";

@Component({
  selector: 'project-template',
  templateUrl: './project-template.component.html',
  styleUrl: './project-template.component.css'
})
export class ProjectTemplateComponent {
  @Input()
  project!: Project;
  @Input()
  isProjectPage: boolean = false;
  @Input()
  featuredCount: number = 0;
  config: any;

  constructor(private permissionService: PermissionService,
              private projectService: ProjectsService,
              private snackbar: Snackbar,
              private configService: ConfigService,
              private translate: TranslateService) {
    this.config = configService.getConfig();
  }

  like() {
    console.log("Works")
  }

  async deleteEntry(id: string) {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-projects'));

    if (hasPermission) {

    }
  }

  async editEntry(id: string) {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-projects'));

    if (hasPermission) {

    }
  }

  async featureProject(id: string) {
    if (!this.project.is_featured && this.featuredCount >= this.config.MAX_FEATURED_PROJECTS) {
      this.snackbar.showSnackbar(this.translate.instant('PROJECTS.MAX_FEATURED_PROJECTS_EXCEEDED', {amount: this.config.MAX_FEATURED_PROJECTS}), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION)
      return;
    }

    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-projects'));

    if (hasPermission) {
      try {
        const newFeatureValue = !this.project.is_featured;
        await this.projectService.featureProject(id, !this.project.is_featured, this.featuredCount);

        if (newFeatureValue) this.snackbar.showSnackbar(this.translate.instant('PROJECTS.FEATURING_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
        else this.snackbar.showSnackbar(this.translate.instant('PROJECTS.UN_FEATURING_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);

      } catch (error) {
        console.log('Error changing featuring of project', error);
        this.snackbar.showSnackbar(this.translate.instant('PROJECTS.ERROR_OCCURRED'), 'error-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
      }
    }
  }
}
