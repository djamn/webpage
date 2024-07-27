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

@NgModule({
  declarations: [
    TestComponentComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LoginRegisterImageComponent,
    FooterComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, ReactiveFormsModule],
  exports: [
    TestComponentComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LoginRegisterImageComponent,
    FooterComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule {

}
