import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';

import {
  AlphabeticalComparator,
  StringOperator,
  ObjectFilterByKey,
  createFilters,
  createComparator
} from 'app/utils/inventory-operator';

import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import * as _ from 'lodash';

import { WorkflowService } from 'app/services/rackhd/workflow.service';
import { GraphService } from 'app/services/rackhd/graph.service';
import { Workflow, ModalTypes } from 'app/models';

@Component({
  selector: 'app-active-workflow',
  templateUrl: './active-workflow.component.html',
  styleUrls: ['./active-workflow.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ActiveWorkflowComponent implements OnInit {
  workflowsStore: Workflow[] = [];
  allWorkflows: Workflow[] = [];
  selectedWorkflows: Workflow[] = [];
  selectedWorkflow: Workflow;

  action: string;
  isShowModal: boolean;
  rawData: string;

  // data grid helper
  dgDataLoading = false;
  dgPlaceholder = 'No active workflow found!';

  modalTypes: ModalTypes;

  gridFilter: any = {};
  gridComparator: any = {};

  constructor(
    private workflowService: WorkflowService,
    private graphService: GraphService,
    private router: Router
  ){}

  ngOnInit() {
    createFilters(
      this.gridFilter,
      [
        'node', 'instanceId', 'id', 'name', 'injectableName', 'domain',
        'definition', 'context', 'tasks', 'serviceGraph'
      ],
      new Workflow()
    );
    createComparator(this.gridComparator, ["node", "name", "injectableName", "domain"], new Workflow());
    this.modalTypes = new ModalTypes(
      ["Detail", "Tasks", "Options", "Instance Id", "Context", "Definition"]
    );
    this.isShowModal = false;
    this.getAll();
  }

  getAll(): void {
    this.workflowService.getAllActive()
      .subscribe(data => {
        this.workflowsStore = data;
        this.allWorkflows = data;
        this.dgDataLoading = false;
      });
  }

  getMetaData(identifier: string): void {
    this.workflowService.getByIdentifier(identifier)
    .subscribe(data => {
      this.rawData = data;
      this.isShowModal = true;
    })
  }

  deleteSel(){
    let list = [];
    _.forEach(this.selectedWorkflows, workflow => {
      if(!workflow.serviceGraph || workflow.serviceGraph === "false"){
        list.push(this.workflowService.cancelActiveWorkflow(workflow.node));
      }
    });
    if (_.isEmpty(list)) {
      this.isShowModal = false;
      return;
    }

    this.isShowModal = false;
    return forkJoin(list)
    .subscribe((result) => {
      this.refresh();
    });
  }

  getChild(objKey: string, workflow: Workflow){
    this.selectedWorkflow = workflow;
    this.action = _.startCase(objKey);
    this.rawData = workflow && workflow[objKey];
    if (!_.isEmpty(this.rawData))
      this.isShowModal = true;
  }

  getDefinition(workflow: Workflow){
    this.selectedWorkflow = workflow;
    let graphName = workflow.definition.split('/').pop();
    this.graphService.getByIdentifier(graphName)
    .subscribe(
      data => {
        this.rawData = data;
        this.action = "Definition"
        this.isShowModal = true;
      }
    )
  }

  refresh() {
    this.isShowModal = false;
    this.dgDataLoading = true;
    this.getAll();
  }

  batchCancel() {
    if (!_.isEmpty(this.selectedWorkflows)){
      this.action = "Cancel";
      this.isShowModal = true;
    }
  };

  onConfirm(value) {
    switch(value) {
      case 'reject':
        this.isShowModal = false;
        break;
      case 'accept':
        this.isShowModal = false;
        this.deleteSel();
    }
  }

  onFilter(filtered: Workflow[]){
    this.workflowsStore = filtered;
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Cancel':
        this.batchCancel();
        break;
    };
  }

  onCancel(workflow: Workflow) {
    this.selectedWorkflows = [workflow];
    this.action = "Cancel";
    this.isShowModal = true;
  };

  onGetDetails(workflow: Workflow) {
    this.selectedWorkflow = workflow;
    this.action = "Detail";
    this.getMetaData(workflow.instanceId);
  };

  gotoCanvas(workflow){
    let graphId = workflow.instanceId;
    let url = "/operationsCenter/workflowViewer?graphId=" + graphId;
    this.router.navigateByUrl(url);
  }
}
