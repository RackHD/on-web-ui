import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { SolutionCenterComponent} from './solution-center.component';
import { SolutionCenterRoutingModule} from './solution-center-routing.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SolutionCenterRoutingModule
  ],
  declarations: [SolutionCenterComponent]
})

export class SolutionCenterModule { }
