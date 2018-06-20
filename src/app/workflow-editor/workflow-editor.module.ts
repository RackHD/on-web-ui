import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { NodeExtensionService } from '../canvas-graph/node-extension.service';

import { WorkflowCanvasComponent } from './workflow-canvas/workflow-canvas.component';
import { WorkflowEditorComponent } from './workflow-editor.component';
import { WorkflowEditorRoutingModule } from './workflow-editor-routing.module';
import { CanvasGraphModule } from '../canvas-graph/canvas-graph.module';
import { InventoryModule } from 'app/inventory/inventory.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkflowEditorRoutingModule,
    CanvasGraphModule,
    InventoryModule,
  ],
  declarations: [
    WorkflowEditorComponent,
    WorkflowCanvasComponent
  ],
  providers: [
    NodeExtensionService,
  ],
})
export class WorkflowEditorModule {
}
