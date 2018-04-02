import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
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
  newTasks: any;
  workflowName: any;

  private searchTerms = new Subject<string>();
  workflowStore: any;
  workflows: any;

  constructor(public workflowService: WorkflowService) {
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  searchIterm(term: string): void {
    if (!this.workflowStore) {
      this.workflowService.getWorkflow().subscribe(graphs => {
        this.workflowStore = graphs;
        this.workflows = StringOperator.search(term, this.workflowStore);
      });
    } else {
      this.workflows = StringOperator.search(term, this.workflowStore);
    }
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
    this.selectWorkflow = this.workflowService.getInitWorkflow();
    let container = document.getElementById('jsoneditor');
    let canvas = document.getElementById('mycanvas');

    canvas.setAttribute('height', "1000px");
    canvas.setAttribute('width', "800px");

    let options = { mode: 'code' };
    this.editor = new JSONEditor(container, options);
    this.updateEditor(this.selectWorkflow);

    this.workflowService.getWorkflow().subscribe(graphs => {
      this.workflowStore = graphs;
    });

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
    this.workflowService.putGraph(JSON.stringify(this.selectWorkflow))
      .subscribe();
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
}
