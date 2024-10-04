import {Component, Inject} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {isControlInvalid} from "../../../utility/form-utils";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfigService} from "../../../services/config.service";
import {GuestbookService} from "../../../services/guestbook.service";
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

  constructor(public dialogRef: MatDialogRef<ProjectPopupComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any,
              private configService: ConfigService,
              private projectService: ProjectsService,
              private snackbar: Snackbar,
              private translate: TranslateService) {
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

    if (data) {
      const project = data;
      this.isEditMode = true;
      this.projectId = project.id;
      this.projectForm.patchValue({
        title: project.title,
        short_desc: project.username,
        long_desc: project.entry_message,
        repo_url: project.repo_url,
        external_url: project.external_url,
        project_year: project.year_created,
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

  cancel() {
    this.dialogRef.close(false);
  }

  protected readonly isControlInvalid = isControlInvalid;
}
