
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CatalogsService } from './catalogs.service';
import { NodeService } from './node.service';
import { ObmService } from './obm.service';
import { PollersService } from './pollers.service';
import { SkusService } from './sku.service';
import { WorkflowService } from './workflow.service';
import { GraphTaskService } from './task.service';
import { GraphService } from './graph.service';
import { TagService } from './tag.service';

@NgModule({
  exports: [],
  providers: [
    NodeService,
    CatalogsService,
    PollersService,
    ObmService,
    SkusService,
    WorkflowService,
    GraphTaskService,
    GraphService,
    TagService,
  ]
})
export class RackhdCommonServicesModule {}
