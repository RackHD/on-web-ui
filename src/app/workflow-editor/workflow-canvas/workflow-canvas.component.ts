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
  saveGraphInfo = {status: "", notes: "", type: 0};

  private searchTerms = new Subject<string>();
  workflowStore: any;
  workflows: any;
  inputValue: any;

  isWaitOnMismatch  = false;

  constructor(
    public graphService: GraphService,
    private router: Router
  ) {}

  clearInput() {
    this.inputValue = null;
    this.editor.set({});
    this.onWorkflowInput.emit({});
  }

  getInitTasks() {
    if (!this.workflowStore) {
      this.getworkflowStore();
    }
    this.workflows = this.workflowStore && this.workflowStore.slice(0, 10);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  searchIterm(term: string): void {
    if (!this.workflowStore) {
      this.getworkflowStore();
    }
    this.workflows = StringOperator.search(term, this.workflowStore).slice(0, 10);
  }

  putWorkflowIntoCanvas(friendlyName: any) {
    let workflow = {};
    for (let item of this.workflowStore) {
      if (item.friendlyName.replace(/\s/ig, '') === friendlyName.replace(/\s/ig, '')) {
        workflow = item;
        break;
      }
    }
    if (workflow) {
      this.updateEditor(workflow);
      this.applyWorkflowJson();
    }
  }

  ngOnInit() {
    this.isShowModal = false;
    this.selectWorkflow = this.graphService.getInitGraph();
    let container = document.getElementById('jsoneditor');
    let canvas = document.getElementById('mycanvas');
    canvas.setAttribute('height', "1000px");
    canvas.setAttribute('width', "800px");
    let options = {mode: 'code'};
    this.editor = new JSONEditor(container, options);
    this.updateEditor(this.selectWorkflow);
    this.getworkflowStore();
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchIterm(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
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
    this.updateEditor(this.selectWorkflow);
    this.applyWorkflowJson();
  }

  saveWorkflow() {
    this.selectWorkflow = this.editor.get();
    this.isShowModal = true;
    this.graphService.createGraph(this.selectWorkflow)
      .subscribe(res => {
          this.saveGraphInfo = {
            status: "Saved Successfully!",
            notes: "The workflow has been saved successfully.Do you want to run it?",
            type: 1
          };
        },
        err => {
          this.saveGraphInfo = {
            status: "Saved Failed!",
            notes: JSON.parse(err.error),
            type: 2
          };
        });
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
