import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../services/core/index';

import { OperationsCenterComponent } from './operations-center.component';

const OperationsCenterRoutes: Routes = [
  {path: '', component: OperationsCenterComponent, canLoad: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(OperationsCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class OperationsCenterRoutingModule {
}
