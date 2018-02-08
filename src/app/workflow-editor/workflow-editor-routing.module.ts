import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../services/core/index';
import { WorkflowEditorComponent } from './workflow-editor.component';

const WorkflowEditorRoutes: Routes = [
  {path: '', component: WorkflowEditorComponent, canLoad: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(WorkflowEditorRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WorkflowEditorRoutingModule {
}
