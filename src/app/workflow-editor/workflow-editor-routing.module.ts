import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkflowEditorComponent } from './workflow-editor.component';

const WorkflowEditorRoutes: Routes = [
  {path: '', component: WorkflowEditorComponent}
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
