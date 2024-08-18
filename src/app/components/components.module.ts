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
import {NoEntriesComponentComponent} from "./no-entries-component/no-entries-component.component";
import {GuestbookCreateEntryComponent} from "./guestbook/guestbook-create-entry/guestbook-create-entry.component";
import {RecaptchaFormsModule, RecaptchaModule} from "ng-recaptcha";
import {QuillModule} from "ngx-quill";
import * as Emoji from 'quill2-emoji'
import Quill from "quill";
import {DialogCommentPopupComponent} from "./popups/dialog-comment-popup/dialog-comment-popup.component";
import {DialogPopupComponent} from "./popups/dialog-popup/dialog-popup.component";
import {ButtonYesCancelComponent} from "./button-yes-cancel/button-yes-cancel.component";

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
    NoEntriesComponentComponent,
    GuestbookCreateEntryComponent,
    DialogCommentPopupComponent,
    DialogPopupComponent,
    ButtonYesCancelComponent
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
    NoEntriesComponentComponent,
    GuestbookCreateEntryComponent,
    DialogCommentPopupComponent,
    DialogPopupComponent,
    ButtonYesCancelComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule {

}
