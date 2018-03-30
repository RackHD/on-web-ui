import { NgModule }       from '@angular/core';

import { CanvasGraphComponent }  from './canvas-graph.component';
import { NodeExtensionService } from './node-extension.service';
import { WorkflowService } from 'app/operations-center/services/workflow.service';

@NgModule({
  declarations: [
    CanvasGraphComponent,
  ],
  exports: [
    CanvasGraphComponent,
  ],
  providers: [
    NodeExtensionService,
    WorkflowService
  ]
})
export class CanvasGraphModule {}
