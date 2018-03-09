import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';

import * as _ from 'lodash';

const global = (window as any);

@Component({
  selector: 'app-edit-workflow',
  templateUrl: './edit-workflow.component.html',
  styleUrls: ['./edit-workflow.component.css']
})
export class EditWorkflowComponent implements OnInit, AfterViewInit {
  onWorkflowInput = new EventEmitter();
  workflow: any;
  editor: any;

  constructor(public workflowService: WorkflowService) {
  }

  ngOnInit() {
    this.workflow = this.workflowService.getInitWorkflow();
    let container = document.getElementById('jsoneditor');
    let options = {mode: 'code'};
    console.log("global======",global);
    // console.log("global.JSONEditor======",global.JSONEditor);
    // console.log("JSONEditor======",JSONEditor);
    this.editor = new global.JSONEditor(container, options);
    this.updateEditor(this.workflow);
  }

  ngAfterViewInit() {
    this.pushDataToCanvas();
  }

  applyWorkflowJson() {
    this.workflow = this.editor.get();
    this.pushDataToCanvas();
  }

  updateEditor(workflow: any) {
    this.editor.set(workflow);
  }

  pushDataToCanvas() {
    this.onWorkflowInput.emit(_.cloneDeep(this.workflow));
  }

  onWorkflowChanged(workflow: any) {
    if (!_.isEqual(workflow, this.workflow)) {
      this.workflow = workflow;
      this.updateEditor(workflow);
    }
  }

}
