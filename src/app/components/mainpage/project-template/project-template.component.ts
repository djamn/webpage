import {Component, Input, OnInit} from '@angular/core';
import {Project} from "../../../types/projects.type";
import {PermissionService} from "../../../services/permission.service";
import {TranslateService} from "@ngx-translate/core";
import {firstValueFrom} from "rxjs";
import {ProjectsService} from "../../../services/projects.service";
import {Snackbar} from "../../../utility/snackbar";
import {ConfigService} from "../../../services/config.service";
import {PopupService} from "../../../services/popup.service";
import {
  faArrowUpRightFromSquare,
  faGear,
  faHeart as faHeartSolid,
  faListCheck,
  faStar as faStarSolid,
  faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import {faHeart, faStar} from "@fortawesome/free-regular-svg-icons";
import {getAuth} from "@angular/fire/auth";

@Component({
  selector: 'project-template',
  templateUrl: './project-template.component.html',
  styleUrl: './project-template.component.css'
})
export class ProjectTemplateComponent implements OnInit {
  @Input()
  project!: Project;
  @Input()
  isProjectPage: boolean = false;
  @Input()
  featuredCount: number = 0;
  config: any;
  isLiked: boolean = false;
  likedProjects: string[] = []

  constructor(protected permissionService: PermissionService,
              private projectService: ProjectsService,
              private snackbar: Snackbar,
              private configService: ConfigService,
              private popupService: PopupService,
              private translate: TranslateService) {
    this.config = configService.getConfig();
  }

  ngOnInit() {
    this.fetchLike();
  }

  fetchLike() {
    this.likedProjects = JSON.parse(localStorage.getItem('LIKED_PROJECTS') || '[]');
    this.isLiked = this.likedProjects.includes(this.project.id);

    if (!this.isLiked) {
      // TODO make db request
    }
  }

  async like() {
    console.log(getAuth().currentUser)
    if (!getAuth().currentUser) {
      this.likedProjects.push(this.project.id);
      localStorage.setItem('LIKED_PROJECTS', JSON.stringify(this.likedProjects));
    } else {
      // TODO handle user like
    }

    console.log("Trying to like the project")
    try {
      await this.projectService.likeProject(this.project.id, this.project.likes);
      console.log("Successfully liked!");
    } catch (err) {
      console.error("There was an error liking the project:", err)
    }


    // TODO db update

  }

  async deleteProject(id: string) {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-projects'));

    if (hasPermission) {
      this.popupService.openPopup(this.translate.instant('DIALOG.DELETE_PROJECT_DESC', {}), this.translate.instant('BUTTONS.BUTTON_DELETE')).subscribe(async (result) => {
        if (result) {
          try {
            await this.projectService.deleteProject(id);
            this.snackbar.showSnackbar(this.translate.instant('PROJECTS.DELETION_SUCCESSFUL'), 'success-snackbar', this.config.SNACKBAR_SUCCESS_DURATION);
          } catch (err) {
            console.error('Error deleting project entry:', err);
            this.snackbar.showSnackbar(this.translate.instant('PROJECTS.DELETION_UNSUCCESSFUL'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
          }
        }
      })
    }
  }

  async editProject() {
    const hasPermission = await firstValueFrom(this.permissionService.hasPermission('manage-projects'));

    if (hasPermission) this.popupService.openUpdateProjectPopup(this.project, this.featuredCount);
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

  protected readonly faListCheck = faListCheck;
  protected readonly faArrowUpRightFromSquare = faArrowUpRightFromSquare;
  protected readonly faHeart = faHeart;
  protected readonly faHeartSolid = faHeartSolid;
  protected readonly faStarSolid = faStarSolid;
  protected readonly faStar = faStar;
  protected readonly faGear = faGear;
  protected readonly faTrashCan = faTrashCan;
}
