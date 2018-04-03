//////////////////////////////////////////////////////////////////////
// This file is to service used in management center
//
//////////////////////////////////////////////////////////////////////
import { NgModule, ModuleWithProviders } from '@angular/core';

// import { NodeService } from './node.service';
import { ProfileService } from './profile.service';
import { TemplateService } from './template.service';
import { FileService } from './file.service';
import { ConfigService } from './config.service';
import { IbmService } from './ibm.service';


@NgModule({
  exports: [],
  providers: [
    // NodeService,
    ProfileService,
    TemplateService,
    FileService,
    ConfigService,
    IbmService,
  ]
})
export class ManagementCenterServicesModule {}
