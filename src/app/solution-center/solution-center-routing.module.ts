import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../services/core/index';
import { SolutionCenterComponent } from './solution-center.component';

const SolutionCenterRoutes: Routes = [
  {path: '', component: SolutionCenterComponent, canLoad: [AuthGuard]}
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
