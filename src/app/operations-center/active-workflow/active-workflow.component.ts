import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

import {
  AlphabeticalComparator,
  StringOperator,
  ObjectFilterByKey,
  createFilters,
  createComparator
} from '../../utils/inventory-operator';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import * as _ from 'lodash';

import { WorkflowService } from '../services/workflow.service';
import { GraphService } from '../../management-center/services/graph.service';
import { Workflow, PAGE_SIZE_OPTIONS, ModalTypes } from '../../models';

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
  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No active workflow found!'
  selectedPageSize = "15";
  pageSizes = PAGE_SIZE_OPTIONS;

  modalTypes: ModalTypes;

  get dgPageSize() {
    return parseInt(this.selectedPageSize);
  }

  constructor(
    private workflowService: WorkflowService,
    private graphService: GraphService,
    private router: Router
  ){}

  ngOnInit() {
    createFilters(
      this,
      [
        'node', 'instanceId', 'id', 'name', 'injectableName', 'domain',
        'definition', 'context', 'tasks', 'serviceGraph'
      ],
      new Workflow()
    );
    createComparator(this, ["node", "name", "injectableName", "domain"], new Workflow());
    this.modalTypes = new ModalTypes(
      ["Detail", "Tasks", "Options", "Instance Id", "Context", "Definition"]
    );
    this.isShowModal = false;
    this.getAll();
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchWorkflow(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
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

  //getRawData(identifier: string): void {}

  searchWorkflow(term: string){
    this.dgDataLoading = true;
    this.workflowsStore = StringOperator.search(term,this.allWorkflows);
    this.dgDataLoading = false;
  }

  cancelActiveWorkflow(){
    let promises = [];
    _.forEach(this.selectedWorkflows, workflow => {
      if(!workflow.serviceGraph || workflow.serviceGraph === "false"){
        promises.push(this.workflowService.cancelWorkflow(workflow.node).toPromise());
      }
    });
    if (_.isEmpty(promises)) {
      this.isShowModal = false;
      return; 
    }
    return Promise.all(promises)
    .then(() => {
      this.onRefresh();
      this.isShowModal = false;
    });
  }

  getHttpMethod(){
  }

  getChild(objKey: string, workflow: Workflow){
    this.selectedWorkflow = workflow;
    this.action = _.startCase(objKey);
    this.rawData = workflow && workflow[objKey];
    this.isShowModal = true;
  }

  getDefinition(workflow: Workflow){
    this.selectedWorkflow = workflow;
    let graphName = workflow.definition.split('/').pop();
    this.graphService.getByIdentifier(graphName).subscribe(
      data => {
        this.rawData = data;
        this.action = "Definition"
        this.isShowModal = true;
      }
    )
  }

  onRefresh() {
    this.isShowModal = false;
    this.dgDataLoading = true;
    this.getAll();
  }

  // onBatchDelete() {};

  // onDelete(workflow: Workflow) {};

  onBatchCancel() {
    if (!_.isEmpty(this.selectedWorkflows)){
      this.action = "Cancel";
      this.isShowModal = true;
    }
  };

  onCancel(workflow: Workflow) {
    this.selectedWorkflows = [workflow];
    this.action = "Cancel";
    this.isShowModal = true;
  };

  // onCreate(){}

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  // onUpdate(workflow: Workflow){}

  onGetDetails(workflow: Workflow) {
    this.selectedWorkflow = workflow;
    this.action = "Detail";
    this.getMetaData(workflow.instanceId);
  };

  // onGetRawData() {};

  // onChange(){}

  // onCancel(){}

  gotoCanvas(workflow){
    let graphId = workflow.instanceId;
    let url = "/operationsCenter/workflowViewer?graphId=" + graphId;
    this.router.navigateByUrl(url);
  }

  // onCreateSubmit(){}

  onSubmit(){
    this.cancelActiveWorkflow();
  }
}
