import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OperationsCenterComponent } from './operations-center.component';
import { ActiveWorkflowComponent } from './active-workflow/active-workflow.component';
import { HistoryWorkflowComponent } from  './history-workflow/history-workflow.component';

const OperationsCenterRoutes: Routes = [
  {
    path: '',
    component: OperationsCenterComponent,
    children: [
      {path: 'activeWorkflow', component: ActiveWorkflowComponent},
      {path: 'historyWorkflow', component: HistoryWorkflowComponent}
    ]
  }
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
