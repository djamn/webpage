import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'

import { TestComponentComponent } from './test-component/test-component.component'
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [
        TestComponentComponent,
    ],
    // imports: [CommonModule, RouterModule, FormsModule, MatFormField, MatSelect, MatOption],
  imports: [CommonModule, RouterModule, FormsModule],
    exports: [
        TestComponentComponent,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class ComponentsModule {

}
