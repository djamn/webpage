import {Component, Inject} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {isControlInvalid} from "../../../utility/form-utils";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfigService} from "../../../services/config.service";
import {Snackbar} from "../../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";
import {ProjectsService} from "../../../services/projects.service";

@Component({
  selector: 'app-create-project-popup',
  templateUrl: './project-popup.component.html',
  styleUrl: './project-popup.component.css'
})
export class ProjectPopupComponent {
  config: any;
  projectForm!: UntypedFormGroup;
  projectId: string | null = null;
  isEditMode: boolean = false;
  featuredCount: number = 0;
  isFeatured: boolean = false;

  constructor(public dialogRef: MatDialogRef<ProjectPopupComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any,
              readonly configService: ConfigService,
              readonly projectService: ProjectsService,
              readonly snackbar: Snackbar,
              readonly translate: TranslateService) {
    this.config = this.configService.getConfig();

    this.projectForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [
        Validators.required,
      ]),
      short_desc: new UntypedFormControl('', [
        Validators.required,
      ]),
      long_desc: new UntypedFormControl('', [
        Validators.required,
      ]),
      repo_url: new UntypedFormControl('', []),
      external_url: new UntypedFormControl('', []),
      project_year: new UntypedFormControl('', [
        Validators.required,
      ]),
      is_featured: new UntypedFormControl('', []),
    })

    this.featuredCount = data.featuredCount;

    if (data.project) {
      const project = data.project;
      this.isEditMode = true;
      this.projectId = project.id;
      this.isFeatured = project.is_featured;
      this.projectForm.patchValue({
        title: project.title,
        short_desc: project.short_desc,
        long_desc: project.long_desc,
        repo_url: project.repo_url,
        external_url: project.external_url,
        project_year: project.project_year,
        is_featured: project.is_featured,
      })
    }
  }

  async confirm() {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      this.snackbar.showSnackbar(this.translate.instant('PROJECTS.FIELDS_HAVE_ERRORS'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
      return;
    }

    const project = this.projectForm.value;

    try {
      if (this.isEditMode) {
        await this.projectService.updateProject(this.projectId!, project.title, Date.now(), project.short_desc, project.long_desc, '', project.repo_url, project.external_url, project.is_featured, project.project_year, '/assets/no-image.svg');
        this.snackbar.showSnackbar(this.translate.instant('PROJECTS.PROJECT_UPDATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      } else {
        await this.projectService.addProject(project.title, Date.now(), project.short_desc, project.long_desc, '', project.repo_url, project.external_url, project.is_featured, project.project_year, '/assets/no-image.svg');
        this.snackbar.showSnackbar(this.translate.instant('PROJECTS.PROJECT_CREATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      }
      this.dialogRef.close(true);

    } catch (e) {
      console.error("Project creation error:", e);
      this.snackbar.showSnackbar(this.translate.instant('PROJECTS.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  checkFeaturedCount() {
    return this.isFeatured || (this.featuredCount < this.config.MAX_FEATURED_PROJECTS);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  protected readonly isControlInvalid = isControlInvalid;
}
