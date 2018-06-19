import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OperationsCenterComponent } from './operations-center.component';
import { ActiveWorkflowComponent } from './active-workflow/active-workflow.component';
import { HistoryWorkflowComponent } from  './history-workflow/history-workflow.component';
import { WorkflowViewerComponent } from './workflow-viewer/workflow-viewer.component';
import { RunWorkflowComponent } from './run-workflow/run-workflow.component';

const OperationsCenterRoutes: Routes = [
  {
    path: '',
    component: OperationsCenterComponent,
    children: [
      {path: '', redirectTo: 'activeWorkflow'},
      {path: 'activeWorkflow', component: ActiveWorkflowComponent},
      {path: 'historyWorkflow', component: HistoryWorkflowComponent},
      {path: 'workflowViewer', component: WorkflowViewerComponent},
      {path: 'runWorkflow', component: RunWorkflowComponent},
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
