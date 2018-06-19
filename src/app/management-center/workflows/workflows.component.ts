import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AlphabeticalComparator,
  isJsonTextValid,
  ObjectFilterByKey
} from 'app/utils/inventory-operator';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs/observable/forkJoin'

import * as _ from 'lodash';

import { GraphService } from 'app/services/rackhd/graph.service';
import { Graph, ModalTypes } from 'app/models';

@Component({
  selector: 'app-workflows',
  templateUrl: './workflows.component.html',
  styleUrls: ['./workflows.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WorkflowsComponent implements OnInit {
  workflowsStore: Graph[] = [];
  allWorkflows: Graph[] = [];
  selectedWorkflows: Graph[] = [];
  selectedWorkflow: Graph;

  action: string;
  isShowModal: boolean;
  rawData: string;
  modalFormGroup: FormGroup;
  // data grid helper
  dgDataLoading = false;
  dgPlaceholder = 'No workflow found!';

  optionsJsonValid = true;
  tasksJsonValid = true;

  modalTypes: ModalTypes;

  public friendlyNameComparator = new AlphabeticalComparator<Graph>('friendlyName');
  public injectableNameComparator = new AlphabeticalComparator<Graph>('injectableName');

  public friendlyNameFilter = new ObjectFilterByKey<Graph>('friendlyName');
  public injectableNameFilter = new ObjectFilterByKey<Graph>('injectableName');
  public optionsFilter = new ObjectFilterByKey<Graph>('options');
  public tasksFilter = new ObjectFilterByKey<Graph>('tasks');

  constructor(
    private workflowService: GraphService,
    private router: Router) {}

  ngOnInit() {
    this.isShowModal = false;
    this.getAll();
    this.modalTypes = new ModalTypes(["Tasks", "Detail", "Options"]);
  }

  getAll(): void {
    this.workflowService.getAll()
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

  upsertGraph(payload: object): void {
    this.isShowModal = false;
    this.workflowService.put(payload, 'text')
    .subscribe()
  }

  getChild(objKey: string, workflow: Graph){
    this.selectedWorkflow = workflow;
    this.action = _.capitalize(objKey);
    this.rawData = workflow && workflow[objKey];
    if (!_.isEmpty(this.rawData))
      this.isShowModal = true;
  }

  createFormGroup(workflow?: Graph){
    this.modalFormGroup = new FormGroup({
      injectableName: new FormControl(''),
      friendlyName: new FormControl(''),
      options: new FormControl(''),
      tasks: new FormControl('')
    });
    if (!_.isEmpty(workflow)) {
      let _workflow = _.cloneDeep(workflow);
      _workflow.options = JSON.stringify(_workflow.options);
      _workflow.tasks = JSON.stringify(_workflow.tasks);
      this.modalFormGroup.patchValue(_workflow);
    }
  }

  refresh() {
    this.isShowModal = false;
    this.dgDataLoading = true;
    this.getAll();
  }

  batchDelete() {
    if (!_.isEmpty(this.selectedWorkflows)){
      this.action = "Delete";
      this.isShowModal = true;
    }
  };

  create(){
    if(!this.modalFormGroup){
      this.createFormGroup();
    }
    this.action = "Create";
    this.isShowModal = true;
  }

  onFilter(filtered: Graph[]){
    this.workflowsStore = filtered;
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Create':
        this.create();
        break;
      case 'Delete':
        this.batchDelete();
        break;
    };
  }


  onUpdate(workflow: Graph){
    this.selectedWorkflow = workflow;
    this.createFormGroup(this.selectedWorkflow);
    this.action = "Update";
    this.isShowModal = true;
  }

  onDelete(workflow: Graph) {
    this.selectedWorkflows = [workflow];
    this.action = "Delete";
    this.isShowModal = true;
  };

  onGetDetails(workflow: Graph) {
    this.selectedWorkflow = workflow;
    this.action = "Detail";
    this.getMetaData(workflow.injectableName);
  };

  // onGetRawData() {};

  // onChange(){}

  onCancel(){
    this.action = '';
    this.selectedWorkflow = null;
    this.selectedWorkflows = [];
    this.isShowModal = false;
    this.optionsJsonValid = true;
    this.tasksJsonValid = true;
  }

  onDeleteSubmit(){
    let list = _.map(this.selectedWorkflows, workflow =>{
      return this.workflowService.delete(workflow.injectableName);
    });
    this.isShowModal = false;
    return forkJoin(list)
    .subscribe(
      data => { this.refresh(); }
    )
  }

  gotoCanvas(workflow){
    let graphName = workflow.injectableName;
    let url = "/operationsCenter/workflowViewer?graphName=" + graphName;
    this.router.navigateByUrl(url);
  }

  onSubmit(){
    let payload = this.modalFormGroup.value;
    this.optionsJsonValid = isJsonTextValid(payload.options);
    this.tasksJsonValid = isJsonTextValid(payload.tasks);
    if (this.optionsJsonValid && this.tasksJsonValid) {
      payload.options = _.isEmpty(payload.options) ? {} : JSON.parse(payload.options);
      payload.tasks = _.isEmpty(payload.tasks) ? [] : JSON.parse(payload.tasks);
      this.upsertGraph(payload);
    }
  }
}
