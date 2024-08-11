import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {CommonModule} from '@angular/common'

import {TestComponentComponent} from './test-component/test-component.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material-module";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {LoginRegisterImageComponent} from "./login-register-image/login-register-image.component";
import {FooterComponent} from "./footer/footer.component";
import {TranslateModule} from "@ngx-translate/core";
import {GuestbookMainComponent} from "./guestbook-main-component/guestbook-main-component.component";
import {GuestbookEntryComponent} from "./guestbook-entry-component/guestbook-entry-component.component";
import {GuestbookPageComponent} from "./guestbook-page-component/guestbook-page-component.component";
import {GuestbookComponent} from "./guestbook-component/guestbook-component.component";
import {NoEntriesComponentComponent} from "./no-entries-component/no-entries-component.component";

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
  ],
    imports: [CommonModule, RouterModule, FormsModule, MaterialModule, ReactiveFormsModule, TranslateModule],
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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule {

}
