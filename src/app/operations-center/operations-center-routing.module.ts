import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OperationsCenterComponent } from './operations-center.component';

const OperationsCenterRoutes: Routes = [
  {path: '', component: OperationsCenterComponent}
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
