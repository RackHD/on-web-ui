import { NgModule }       from '@angular/core';

import { CanvasGraphComponent }  from './canvas-graph.component';
import { NodeExtensionService } from './node-extension.service';

@NgModule({
  declarations: [
    CanvasGraphComponent,
  ],
  exports: [
    CanvasGraphComponent,
  ],
  providers: [
    NodeExtensionService,
  ]
})
export class CanvasGraphModule {}
