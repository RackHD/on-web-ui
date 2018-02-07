import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { OperationsCenterComponent } from './operations-center.component';
import { OperationsCenterRoutingModule } from './operations-center-routing.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OperationsCenterRoutingModule
  ],
  declarations: [OperationsCenterComponent]
})

export class OperationsCenterModule {
}
