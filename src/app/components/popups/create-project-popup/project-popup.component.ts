import {Component, Inject} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {isControlInvalid} from "../../../utility/form-utils";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ConfigService} from "../../../services/config.service";
import {Snackbar} from "../../../utility/snackbar";
import {TranslateService} from "@ngx-translate/core";
import {ProjectsService} from "../../../services/projects.service";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {finalize} from "rxjs";

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
  selectedImage: File | null = null;
  imagePreview: string | null = null;

  constructor(public dialogRef: MatDialogRef<ProjectPopupComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any,
              readonly configService: ConfigService,
              readonly projectService: ProjectsService,
              readonly snackbar: Snackbar,
              readonly storage: AngularFireStorage,
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
      this.imagePreview = project.image_url
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
      let imageUrl = this.config.PROJECTS_NO_IMAGE_SRC; // Default image path

      if (this.selectedImage) {
        imageUrl = await this.uploadImageAndGetURL();
        console.debug('File uploaded, URL:', imageUrl);
      }

      if (this.isEditMode) {
        await this.projectService.updateProject(this.projectId!, project.title, Date.now(), project.short_desc, project.long_desc, '', project.repo_url, project.external_url, project.is_featured, project.project_year, imageUrl);
        this.snackbar.showSnackbar(this.translate.instant('PROJECTS.PROJECT_UPDATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      } else {
        await this.projectService.addProject(project.title, Date.now(), project.short_desc, project.long_desc, '', project.repo_url, project.external_url, project.is_featured, project.project_year, imageUrl);
        this.snackbar.showSnackbar(this.translate.instant('PROJECTS.PROJECT_CREATED_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION)
      }

      this.dialogRef.close(true);

    } catch (e) {
      console.error("Project creation error:", e);
      this.snackbar.showSnackbar(this.translate.instant('PROJECTS.UNEXPECTED_ERROR'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  // TODO handle in service?
  async uploadImageAndGetURL(): Promise<string> {
    if (this.selectedImage) {
      const filePath = `images/${Date.now()}_${this.selectedImage.name}`;
      const fileRef = this.storage.ref(filePath);
      const uploadTask = this.storage.upload(filePath, this.selectedImage);

      return new Promise((resolve, reject) => {
        uploadTask.snapshotChanges()
          .pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe({
                next: (url) => resolve(url),
                error: (error) => reject(error),
                complete: () => console.log('Download URL retrieval completed')
              });
            })
          )
          .subscribe({
            next: (snapshot) => console.log('Uploading snapshot:', snapshot),
            error: (error) => console.error('Error uploading:', error),
            complete: () => console.log('Upload task completed')
          });
      });
    } else {
      throw new Error("No image selected");
    }
  }


  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImage = file;

      // Generate a preview
      const reader = new FileReader();
      reader.onload = (e) => (this.imagePreview = e.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  deleteImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  checkFeaturedCount() {
    return this.isFeatured || (this.featuredCount < this.config.MAX_FEATURED_PROJECTS);
  }

  cancel() {
    this.dialogRef.close(false);
  }

  protected readonly isControlInvalid = isControlInvalid;
}
