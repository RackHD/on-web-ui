import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

import { WorkflowEditorComponent } from './workflow-editor.component';
import { WorkflowEditorRoutingModule } from './workflow-editor-routing.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    WorkflowEditorRoutingModule
  ],
  declarations: [WorkflowEditorComponent]
})
export class WorkflowEditorModule {
}
