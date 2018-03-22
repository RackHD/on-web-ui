import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { OperationCenterServiceModule } from './services/operation-center-service.module';
import { ManagementCenterServicesModule } from '../management-center/services/management-center-service.module';

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
    OperationsCenterRoutingModule,
    OperationCenterServiceModule,
    ManagementCenterServicesModule,
  ],
  declarations: [
    OperationsCenterComponent,
    ActiveWorkflowComponent,
    HistoryWorkflowComponent,
  ]
})

export class OperationsCenterModule {
}
