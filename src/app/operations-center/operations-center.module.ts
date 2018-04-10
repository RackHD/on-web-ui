import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { ManagementCenterServicesModule } from '../management-center/services/management-center-service.module';

import { ActiveWorkflowComponent } from './active-workflow/active-workflow.component';
import { HistoryWorkflowComponent } from './history-workflow/history-workflow.component';
import { WorkflowViewerComponent } from './workflow-viewer/workflow-viewer.component';

import { OperationCenterServiceModule } from './services/operation-center-service.module';

import { OperationsCenterComponent } from './operations-center.component';
import { OperationsCenterRoutingModule } from './operations-center-routing.module';

import { CanvasGraphModule } from '../canvas-graph/canvas-graph.module';
import { RunWorkflowComponent } from './run-workflow/run-workflow.component';
// import { SharedServicesModule } from '../services/sharedServices.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OperationsCenterRoutingModule,
    OperationCenterServiceModule,
    ManagementCenterServicesModule,
    CanvasGraphModule,
  ],
  declarations: [
    OperationsCenterComponent,
    ActiveWorkflowComponent,
    HistoryWorkflowComponent,
    WorkflowViewerComponent,
    RunWorkflowComponent,
  ],
  providers: [
    OperationCenterServiceModule,
    // SharedServicesModule
  ]
})

export class OperationsCenterModule {}
