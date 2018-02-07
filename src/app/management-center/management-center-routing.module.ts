import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../services/core/index';
import { ManagementCenterComponent } from './management-center.component';

const ManagementCenterRoutes: Routes = [
  {path: '', component: ManagementCenterComponent, canLoad: [AuthGuard]}
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
