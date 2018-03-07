import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
// the dependent files of ManagementCenter
import { ManagementCenterComponent } from './management-center.component';
import { ManagementCenterRoutingModule } from './management-center-routing.module';
// child component
import { NodesComponent } from './nodes/nodes.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { PollersComponent } from './pollers/pollers.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { ObmComponent } from './obm/obm.component';
import { SkuComponent } from './sku/sku.component';
import { FilesComponent } from './files/files.component';
import { TemplatesComponent } from './templates/templates.component';
import { ConfigComponent } from './config/config.component';
import { ManagementCenterServicesModule } from './services/management-center-service.module'
// the dependent services of ManagementCenter

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManagementCenterRoutingModule,
    ManagementCenterServicesModule
  ],
  declarations: [
    ManagementCenterComponent,
    NodesComponent,
    ProfilesComponent,
    PollersComponent,
    WorkflowsComponent,
    CatalogsComponent,
    ObmComponent,
    SkuComponent,
    FilesComponent,
    TemplatesComponent,
    ConfigComponent,
  ]
})

export class ManagementCenterModule {
}
