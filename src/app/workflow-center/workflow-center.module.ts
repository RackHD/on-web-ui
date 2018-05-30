import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { NodeExtensionService } from '../canvas-graph/node-extension.service';

import { ManagementCenterServicesModule } from '../management-center/services/management-center-service.module';

import { ActiveWorkflowComponent } from './active-workflow/active-workflow.component';
import { HistoryWorkflowComponent } from './history-workflow/history-workflow.component';
import { WorkflowViewerComponent } from './workflow-viewer/workflow-viewer.component';
import { RunWorkflowComponent } from './run-workflow/run-workflow.component';

import { WorkflowCenterComponent } from './workflow-center.component';
import { WorkflowCenterRoutingModule } from './workflow-center-routing.module';

import { CanvasGraphModule } from 'app/canvas-graph/canvas-graph.module';
import { InventoryModule } from 'app/inventory/inventory.module';
import { WorkflowEditorComponent } from './workflow-editor/workflow-editor.component';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkflowCenterRoutingModule,
    ManagementCenterServicesModule,
    CanvasGraphModule,
    InventoryModule,
  ],
  declarations: [
    WorkflowCenterComponent,
    ActiveWorkflowComponent,
    HistoryWorkflowComponent,
    WorkflowViewerComponent,
    RunWorkflowComponent,
    WorkflowEditorComponent,
  ],
  providers: [NodeExtensionService ]
})

export class WorkflowCenterModule {}
