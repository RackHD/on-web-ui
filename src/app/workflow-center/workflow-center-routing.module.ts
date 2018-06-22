import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkflowCenterComponent } from './workflow-center.component';
import { ActiveWorkflowComponent } from './active-workflow/active-workflow.component';
import { HistoryWorkflowComponent } from  './history-workflow/history-workflow.component';
import { WorkflowViewerComponent } from './workflow-viewer/workflow-viewer.component';
import { RunWorkflowComponent } from './run-workflow/run-workflow.component';
import { WorkflowEditorComponent } from './workflow-editor/workflow-editor.component';

const WorkflowCenterRoutes: Routes = [
  {
    path: '',
    component: WorkflowCenterComponent,
    children: [
      {path: '', redirectTo: 'activeWorkflow'},
      {path: 'activeWorkflow', component: ActiveWorkflowComponent},
      {path: 'historyWorkflow', component: HistoryWorkflowComponent},
      {path: 'workflowViewer', component: WorkflowViewerComponent},
      {path: 'runWorkflow', component: RunWorkflowComponent},
      {path: 'workflowEditor', component: WorkflowEditorComponent},
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(WorkflowCenterRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WorkflowCenterRoutingModule {
}
