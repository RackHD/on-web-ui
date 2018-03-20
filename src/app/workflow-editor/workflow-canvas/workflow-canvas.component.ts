import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { WorkflowService } from '../../services/workflow.service';
import { JSONEditor } from '../../utils/json-editor'

import * as _ from 'lodash';

const global = (window as any);

@Component({
  selector: 'app-workflow-canvas',
  templateUrl: './workflow-canvas.component.html',
  styleUrls: ['./workflow-canvas.component.scss']
})
export class WorkflowCanvasComponent implements OnInit, AfterViewInit {
  onWorkflowInput = new EventEmitter();
  workflow: any;
  editor: any;

  constructor(public workflowService: WorkflowService) {
  }

  ngOnInit() {
    this.workflow = this.workflowService.getInitWorkflow();
    let container = document.getElementById('jsoneditor');

    let height = document.getElementsByClassName('workflow-editor-graph')[0].offsetHeight + 'px';
    let width = document.getElementsByClassName('workflow-editor-graph')[0].offsetWidth + 'px';
    let canvas = document.getElementById('mycanvas');

    canvas.setAttribute('height',height);
    canvas.setAttribute('width',width);
    console.log(canvas);

    let options = {mode: 'code'};
    this.editor = new JSONEditor(container, options);
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
