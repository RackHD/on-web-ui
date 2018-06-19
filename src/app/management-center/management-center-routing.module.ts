import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ManagementCenterComponent } from './management-center.component';

import { NodesComponent } from './nodes/nodes.component';
import { ProfilesComponent } from './profiles/profiles.component';
import { PollersComponent } from './pollers/pollers.component';
import { WorkflowsComponent } from './workflows/workflows.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { ObmComponent } from './obms/obm.component';
import { SkuComponent } from './skus/sku.component';
import { FilesComponent } from './files/files.component';
import { TemplatesComponent } from './templates/templates.component';
import { ConfigComponent } from './configs/config.component';

const ManagementCenterRoutes: Routes = [
  {
    path: '',
    component: ManagementCenterComponent,
    children: [
      {path: '', redirectTo: 'nodes'},
      {path: 'nodes', component: NodesComponent},
      {path: 'profiles', component: ProfilesComponent},
      {path: 'pollers', component: PollersComponent},
      {path: 'workflows', component: WorkflowsComponent},
      {path: 'catalogs', component: CatalogsComponent},
      {path: 'obms', component: ObmComponent},
      {path: 'skus', component: SkuComponent},
      {path: 'files', component: FilesComponent},
      {path: 'templates', component: TemplatesComponent},
      {path: 'configs', component: ConfigComponent}
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ManagementCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ManagementCenterRoutingModule {
}
