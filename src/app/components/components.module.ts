import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core'
import {RouterModule} from '@angular/router'
import {CommonModule} from '@angular/common'

import {TestComponentComponent} from './test-component/test-component.component'
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MaterialModule} from "../material-module";
import {LoginTestComponent} from "./login-test/login-test.component";
import {LoginFormTestComponent} from "./login-form-test/login-form-test.component";

@NgModule({
  declarations: [
    TestComponentComponent,
    LoginTestComponent,
    LoginFormTestComponent
  ],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, ReactiveFormsModule],
  exports: [
    TestComponentComponent,
    LoginTestComponent,
    LoginFormTestComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule {

}
