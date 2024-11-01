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
import {UserService} from "../../../services/user.service";
import confetti from 'canvas-confetti';

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
              readonly projectService: ProjectsService,
              readonly snackbar: Snackbar,
              readonly userService: UserService,
              readonly configService: ConfigService,
              readonly popupService: PopupService,
              readonly translate: TranslateService) {
    this.config = configService.getConfig();
  }

  ngOnInit() {
    this.fetchLike();
  }

  fetchLike() {
    if (getAuth().currentUser) {
      this.userService.getUserLikedProjects().subscribe({
        next: (data) => {
          this.likedProjects = data || [];
          this.isLiked = data?.includes(this.project.id) || false;
        },
        error: (err) => {
          console.error('Error fetching liked projects entries:', err);
        },
      })
    } else {
      this.likedProjects = JSON.parse(localStorage.getItem('LIKED_PROJECTS') || '[]');
      this.isLiked = this.likedProjects.includes(this.project.id);
    }
  }

  async handleLike(event: MouseEvent) {
    console.log("Attempting to like the project");

    this.likedProjects.push(this.project.id);

    try {
      if (!getAuth().currentUser) {
        console.debug("User not authenticated - saving liked projects to storage");
        localStorage.setItem('LIKED_PROJECTS', JSON.stringify(this.likedProjects));
      } else {
        console.debug("User authenticated - updating liked projects in Firestore");
        await this.userService.updateUserLikedProjects(this.likedProjects);
      }

      this.project.likes += 1;
      await this.projectService.likeProject(this.project.id, this.project.likes);
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      this.triggerConfetti(x, y);

    } catch (error) {
      console.error("Error liking project:", error);
      this.snackbar.showSnackbar(this.translate.instant('PROJECTS.LIKING_UNSUCCESSFUL'), 'error-snackbar', this.config.SNACKBAR_ERROR_DURATION);
    }
  }

  // https://github.com/catdad/canvas-confetti
  triggerConfetti(x: number, y: number) {
    confetti({
      particleCount: 100,
      spread: 70,
      startVelocity: 20, // Lowers initial velocity for reduced height
      gravity: 1.2,      // Increases gravity for quicker descent
      scalar: 0.8,       // Scales down particle size slightly
      origin: {x, y},
    });
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
