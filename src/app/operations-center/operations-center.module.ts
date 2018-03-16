import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { OperationsCenterComponent } from './operations-center.component';
import { OperationsCenterRoutingModule } from './operations-center-routing.module';

import { ActiveWorkflowComponent } from './active-workflow/active-workflow.component';
import { HistoryWorkflowComponent } from './history-workflow/history-workflow.component';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OperationsCenterRoutingModule
  ],
  declarations: [OperationsCenterComponent, ActiveWorkflowComponent, HistoryWorkflowComponent]
})

export class OperationsCenterModule {
}
