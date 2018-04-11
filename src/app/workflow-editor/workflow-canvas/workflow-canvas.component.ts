import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JSONEditor } from '../../utils/json-editor';

import * as _ from 'lodash';
import { WorkflowService } from 'app/operations-center/services/workflow.service';
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
  saveInfor = {status: "", notes: "", type: 0};

  private searchTerms = new Subject<string>();
  workflowStore: any;
  workflows: any;
  inputValue: any;

  constructor(public workflowService: WorkflowService,
              private router: Router) {
  }

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
      if (item['friendlyName'] === friendlyName) {
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
    this.selectWorkflow = this.workflowService.getInitWorkflow();
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
    this.workflowService.getWorkflow().subscribe(graphs => {
      this.workflowStore = graphs;
    });
  }

  applyWorkflowJson() {
    this.selectWorkflow = this.editor.get();
    this.pushDataToCanvas();
  }

  refreshWorkflow() {
    this.updateEditor(this.selectWorkflow);
    this.applyWorkflowJson();
  }

  saveWorkflow() {
    this.selectWorkflow = this.editor.get();
    this.isShowModal = true;
    this.workflowService.putGraph(JSON.stringify(this.selectWorkflow))
      .subscribe(res => {
          this.saveInfor = {
            status: "Saved Successfully!",
            notes: "The Workflow has been saved successfully.Do you want to run it?",
            type: 1
          };
          console.log(res);
        },
        err => {
          this.saveInfor = {
            status: "Saved Failed!",
            notes: "The Workflow has been saved failed.Please check it out.",
            type: 2
          };
          console.log(err);
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
