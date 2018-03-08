import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { NodeExtensionService } from '../canvas-graph/node-extension.service';
import { WorkflowService } from '../services/workflow.service';

import { CanvasGraphComponent } from '../canvas-graph/canvas-graph.component';
import { WorkflowViewerComponent } from '../workflow-viewer/workflow-viewer.component';
import { WorkflowEditorComponent } from './workflow-editor.component';
import { WorkflowEditorRoutingModule } from './workflow-editor-routing.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkflowEditorRoutingModule
  ],
  declarations: [
    CanvasGraphComponent,
    WorkflowEditorComponent,
    WorkflowViewerComponent
  ],
  providers: [
    NodeExtensionService,
    WorkflowService
  ],
})
export class WorkflowEditorModule {
}
