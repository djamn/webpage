import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {CommonModule} from '@angular/common'

import {TestComponentComponent} from './test-component/test-component.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material-module";
import {LoginComponent} from "./authentication/login/login.component";
import {RegisterComponent} from "./authentication/register/register.component";
import {ResetPasswordComponent} from "./authentication/reset-password/reset-password.component";
import {LoginRegisterImageComponent} from "./authentication/login-register-image/login-register-image.component";
import {FooterComponent} from "./footer/footer.component";
import {TranslateModule} from "@ngx-translate/core";
import {GuestbookMainComponent} from "./guestbook/guestbook-main-component/guestbook-main-component.component";
import {GuestbookEntryComponent} from "./guestbook/guestbook-entry-component/guestbook-entry-component.component";
import {GuestbookPageComponent} from "./guestbook/guestbook-page-component/guestbook-page-component.component";
import {GuestbookComponent} from "./guestbook/guestbook-component/guestbook-component.component";
import {RecaptchaFormsModule, RecaptchaModule} from "ng-recaptcha-2";
import {QuillModule} from "ngx-quill";
import * as Emoji from 'quill2-emoji'
import Quill from "quill";
import {DialogCommentPopupComponent} from "./popups/dialog-comment-popup/dialog-comment-popup.component";
import {DialogPopupComponent} from "./popups/dialog-popup/dialog-popup.component";
import {Navbar} from "./navbars/navbar/navbar.component";
import {NoEntriesComponent} from "./no-entries/no-entries.component";
import {MainpageMainComponent} from "./mainpage/mainpage-main-component/mainpage-main-component.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {AdminDashboardComponent} from "./admin/admin-dashboard/admin-dashboard.component";
import {ChangelogComponent} from "./changelog/changelog.component";
import {ChangelogPopupComponent} from "./popups/changelog-popup/changelog-popup.component";
import {CreateEntryPopupComponent} from "./popups/create-entry-popup/create-entry-popup.component";
import {
  MainPageIntroductionComponent
} from "./mainpage/mainpage-introduction-component/mainpage-introduction-component.component";
import {ProjectsComponent} from "./mainpage/projects-component/projects-component.component";
import {ProjectTemplateComponent} from "./mainpage/project-template/project-template.component";
import {ProjectsMainComponent} from "./projects/projects-main-component/projects-main-component.component";
import {ProjectPopupComponent} from "./popups/create-project-popup/project-popup.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {CatCheckAdminComponent} from "./cat-check-component/admin/cat-check-admin-component.component";
import {NavbarLinksComponent} from "./navbars/navbar-links/navbar-links.component";
import {NavbarAuthButtonsComponent} from "./navbars/navbar-auth-buttons/navbar-auth-buttons.component";
import {NavbarButtonsComponent} from "./navbars/navbar-buttons/navbar-buttons.component";

Quill.register("modules/emoji", Emoji);

@NgModule({
  declarations: [
    TestComponentComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LoginRegisterImageComponent,
    FooterComponent,
    GuestbookMainComponent,
    GuestbookEntryComponent,
    GuestbookPageComponent,
    GuestbookComponent,
    NoEntriesComponent,
    DialogCommentPopupComponent,
    DialogPopupComponent,
    CreateEntryPopupComponent,
    Navbar,
    MainpageMainComponent,
    AdminDashboardComponent,
    ChangelogComponent,
    ChangelogPopupComponent,
    MainPageIntroductionComponent,
    ProjectsComponent,
    ProjectTemplateComponent,
    ProjectsMainComponent,
    ProjectPopupComponent,
    NavbarLinksComponent,
    NavbarAuthButtonsComponent,
    NavbarButtonsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    TranslateModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    QuillModule.forRoot(),
    NgSelectModule,
    FontAwesomeModule,
    CatCheckAdminComponent
  ],
  exports: [
    TestComponentComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LoginRegisterImageComponent,
    FooterComponent,
    GuestbookMainComponent,
    GuestbookEntryComponent,
    GuestbookPageComponent,
    GuestbookComponent,
    NoEntriesComponent,
    DialogCommentPopupComponent,
    DialogPopupComponent,
    CreateEntryPopupComponent,
    Navbar,
    MainpageMainComponent,
    AdminDashboardComponent,
    ChangelogComponent,
    ChangelogPopupComponent,
    MainPageIntroductionComponent,
    ProjectsComponent,
    ProjectTemplateComponent,
    ProjectsMainComponent,
    ProjectPopupComponent,
    NavbarLinksComponent,
    NavbarAuthButtonsComponent,
    NavbarButtonsComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule {

}
