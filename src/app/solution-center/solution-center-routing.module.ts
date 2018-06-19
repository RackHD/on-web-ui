import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SolutionCenterComponent } from './solution-center.component';
import { ConfigComponent } from '../management-center/config/config.component';
import { OsInstallComponent } from 'app/solution-center/os-install/os-install.component';

const SolutionCenterRoutes: Routes = [
  {
    path: '',
    component: SolutionCenterComponent,
    children: [
      { path: '', redirectTo: 'osInstall' },
      { path: 'osInstall', component: OsInstallComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(SolutionCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SolutionCenterRoutingModule {
}
