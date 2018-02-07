import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { ManagementCenterComponent } from './management-center.component';
import { ManagementCenterRoutingModule} from './management-center-routing.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManagementCenterRoutingModule
  ],
  declarations: [ManagementCenterComponent]
})

export class ManagementCenterModule { }
