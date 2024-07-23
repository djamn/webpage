import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {CommonModule} from '@angular/common'

import {TestComponentComponent} from './test-component/test-component.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material-module";
import {LoginTestComponent} from "./login-test/login-test.component";
import {LoginFormTestComponent} from "./login-form-test/login-form-test.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {LoginRegisterImageComponent} from "./login-register-image/login-register-image.component";

@NgModule({
  declarations: [
    TestComponentComponent,
    LoginTestComponent,
    LoginFormTestComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LoginRegisterImageComponent,
  ],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, ReactiveFormsModule],
  exports: [
    TestComponentComponent,
    LoginTestComponent,
    LoginFormTestComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    LoginRegisterImageComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule {

}
