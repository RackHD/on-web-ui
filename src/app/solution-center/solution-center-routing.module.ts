import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SolutionCenterComponent } from './solution-center.component';

const SolutionCenterRoutes: Routes = [
  {path: '', component: SolutionCenterComponent}
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
