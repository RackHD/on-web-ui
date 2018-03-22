//////////////////////////////////////////////////////////////////////
// This file is to service used in management center
//
//////////////////////////////////////////////////////////////////////
import { NgModule, ModuleWithProviders } from '@angular/core';

import { WorkflowService } from './workflow.service';


@NgModule({
  exports: [],
  providers: [
    WorkflowService,
  ]
})
export class OperationCenterServiceModule {}
