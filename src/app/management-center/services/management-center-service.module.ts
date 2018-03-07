//////////////////////////////////////////////////////////////////////
// This file is to service used in management center
//
//////////////////////////////////////////////////////////////////////
import { NgModule, ModuleWithProviders } from '@angular/core';

import { NodeService } from './node.service';
import { ProfileService } from './profile.service';
import { TemplateService } from './template.service';


@NgModule({
  exports: [],
  providers: [
    NodeService,
    ProfileService,
    TemplateService,
  ]
})
export class ManagementCenterServicesModule {}
