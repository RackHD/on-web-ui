import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JSONEditor } from '../../utils/json-editor';

import * as _ from 'lodash';
import { WorkflowService } from 'app/services/rackhd/workflow.service';
import { GraphService } from 'app/services/rackhd/graph.service';
import { Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StringOperator } from 'app/utils/inventory-operator';

const global = (window as any);
const SAVE_INFO_INIT = {status: "Saving", notes: 'Waiting...', type: 0};

@Component({
  selector: 'app-workflow-canvas',
  templateUrl: './workflow-canvas.component.html',
  styleUrls: ['./workflow-canvas.component.scss']
})

export class WorkflowCanvasComponent implements OnInit, AfterViewInit {
  onWorkflowInput = new EventEmitter();
  selectWorkflow: any;
  editor: any;
  isShowModal: boolean;
  saveConfirmed: boolean;
  saveGraphInfo = SAVE_INFO_INIT;

  workflowStore: any[] =[];

  isWaitOnMismatch  = false;

  columns = [12];
  placeholders = ["Search workflow definitions"];
  fields = ['injectableName'];

  constructor(
    public graphService: GraphService,
    private router: Router
  ) {}

  clearInput() {
    this.onWorkflowChanged(this.graphService.getInitGraph());
    this.pushDataToCanvas();
    this.saveGraphInfo = SAVE_INFO_INIT;
  }

  putWorkflowIntoCanvas(injectableName: string) {
    let workflow = {};
    for (let item of this.workflowStore) {
      if (item.injectableName.replace(/\s/ig, '') === injectableName.replace(/\s/ig, '')) {
        workflow = item;
        break;
      }
    }
    if (workflow) {
      this.updateEditor(workflow);
      this.applyWorkflowJson();
    }
  }

  onSelected(selWorkflow: any){
    this.selectWorkflow = selWorkflow;
    this.putWorkflowIntoCanvas(selWorkflow.injectableName);
  }

  onRefresh() {
    this.clearInput();
    this.getworkflowStore();
  }

  ngOnInit() {
    this.isShowModal = false;
    this.saveConfirmed = false;
    this.selectWorkflow = this.graphService.getInitGraph();
    let container = document.getElementById('jsoneditor');
    let canvas = document.getElementById('mycanvas');
    canvas.setAttribute('height', "1000px");
    canvas.setAttribute('width', "800px");
    let options = {mode: 'code'};
    this.editor = new JSONEditor(container, options);
    this.updateEditor(this.selectWorkflow);
    this.getworkflowStore();
  }

  ngAfterViewInit() {
    this.pushDataToCanvas();
  }

  getworkflowStore() {
    this.graphService.getAll()
    .subscribe(graphs => {
      this.workflowStore = graphs;
    });
  }

  applyWorkflowJson() {
    let tmpWorkflow = this.editor.get();
    this.isWaitOnMismatch = this.isTaskWaitOnLegal(tmpWorkflow) ? false : true;
    if (!this.isWaitOnMismatch) {
      this.selectWorkflow = tmpWorkflow;
      this.pushDataToCanvas();
    }
  }

  isTaskWaitOnLegal(obj: any): boolean {
    let isLegal = true;
    if (obj && obj.tasks) {
      let taskLables = _.map(obj.tasks, 'label');
      let waitOnLables = _.unionBy(_.flatten(_.map(obj.tasks, 'waitOn').map(_.keys)));
      for (let label of waitOnLables) {
        isLegal = _.includes(taskLables, label);
        if (isLegal === false) {
          break;
        }
      }
    }
    return isLegal;
  }

  refreshWorkflow() {
    let injectableNameTmp = this.selectWorkflow['injectableName'];
    for (let workflow of this.workflowStore) {
      if (workflow['injectableName'] === injectableNameTmp) {
        this.selectWorkflow = workflow;
        this.updateEditor(this.selectWorkflow);
        this.applyWorkflowJson();
        break;
      }
    }
  }

  saveConfirm() {
    this.saveConfirmed = true;
    this.isShowModal = true;
  }

  saveWorkflow() {
    this.selectWorkflow = this.editor.get();
    this.graphService.createGraph(this.selectWorkflow)
    .subscribe(
      res => {
        this.saveGraphInfo = {
          status: "Saved Successfully!",
          notes: 'The workflow ' + this.selectWorkflow.injectableName + ' has been saved successfully. Do you want to run it now?',
          type: 1
        };
      },
      err => { this.isShowModal = false; }
    );
  }

  updateEditor(workflow: any) {
    this.editor.set(workflow);
  }

  pushDataToCanvas() {
    this.onWorkflowInput.emit(_.cloneDeep(this.selectWorkflow));
  }

  onWorkflowChanged(workflow: any) {
    this.selectWorkflow = workflow;
    this.updateEditor(workflow);
  }

  jumpRunWorkflow() {
    this.isShowModal = false;
    this.router.navigate(['operationsCenter/runWorkflow'], {
      queryParams: {
        injectableName: this.editor.get().injectableName
      }
    });
  }
}
