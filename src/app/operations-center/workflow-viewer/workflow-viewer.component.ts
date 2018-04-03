import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WorkflowService } from '../services/workflow.service';
import { Workflow, Graph } from '../../models';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import {
  AlphabeticalComparator,
  StringOperator,
  ObjectFilterByKey
} from '../../utils/inventory-operator';
import { GraphService } from '../../management-center/services/graph.service';

import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/map'

import * as _ from 'lodash';

@Component({
  selector: 'app-workflow-viewer',
  templateUrl: './workflow-viewer.component.html',
  styleUrls: ['./workflow-viewer.component.scss']
})

export class WorkflowViewerComponent implements OnInit, AfterViewInit {
  @ViewChild("viewCanvas") viewCanvas: any;
  onWorkflowInput = new EventEmitter();
  graphId: string;
  isDefinition: boolean = false; // true: graph definition; false: graph object

  selectedWorkflow: any;
  workflowsStore: any[];
  allWorkflows: any [];

  filterForm: FormGroup;
  isDropdownSelected: boolean;
  idDropdownList: string[];
  nameDropdownList: string[];
  nodeDropdownList: string[];
  searchField: string;
  searchTerms = new Subject<string>();
  searchSubscribe: any;

  service: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private workflowService: WorkflowService,
    private graphService: GraphService,
  ){}

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.isDefinition = this.isDefinition || !!params.graphName;
      this.graphId = params && (params.graphId || params.graphName);
    });
    this.service = this.isDefinition ? this.graphService : this.workflowService;
    this.createFormGroup();
  }

  ngAfterViewInit() {
    if (!this.graphId) {
      this.prepareForSearch();
    } else {
      this.updateCanvas();
    }
  }

  prepareForSearch() {
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchWorkflow(term);
        return 'whatever';
      })
    );
    this.searchSubscribe = searchTrigger.subscribe();
    this.service.getAll()
    .subscribe(workflows=> {
      this.allWorkflows = workflows;
      this.getDropdownOptions(this.allWorkflows)
    });
  }

  getDropdownOptions(workflows){
    let i = 0;
    let idKey = this.isDefinition ? "injectableName" : "instanceId";
    let nameKey = this.isDefinition ? "friendlyName" : "name";
    let idList = [];
    let nameList = [];
    let nodeList = [];
    _.forEach(workflows, workflow => {
      idList.push(workflow[idKey]);
      nameList.push(workflow[nameKey]);
      nodeList.push(workflow.node);
      i += 1;
      return (i<10);
    });
    this.idDropdownList = _.uniq(idList);
    this.nameDropdownList = _.uniq(nameList);
    this.nodeDropdownList = _.uniq(nodeList);
  }

  createFormGroup(){
    this.filterForm = new FormGroup({
      graphId: new FormControl(''),
      node: new FormControl(''),
      graphName: new FormControl('')
    });
  }

  updateFormValue(){
    this.filterForm.patchValue({
      graphId: this.graphId,
      node: this.selectedWorkflow && this.selectedWorkflow.node,
      graphName: this.selectedWorkflow &&
        (this.selectedWorkflow.name || this.selectedWorkflow.friendlyName)
    });
  }

  updateCanvas(){
    this.service.getByIdentifier(this.graphId)
    .map(workflowData => {
      this.selectedWorkflow = (workflowData instanceof Array) ? workflowData[0] : workflowData;
      this.onWorkflowInput.emit(_.cloneDeep(this.selectedWorkflow));
    })
    .subscribe(() => {
      this.updateFormValue();
    })
  }

  clearCanvas(){
    this.onWorkflowInput.emit({});
    this.updateFormValue();
    this.prepareForSearch();
  }

  searchWorkflow(term: string): void{
    let excludeFields = _.without(_.keys(this.allWorkflows[0]), this.searchField);
    this.workflowsStore = StringOperator.search(term, this.allWorkflows, excludeFields);
    if (this.isDropdownSelected) {
      this.onSelectSearch(term);
    }
    this.getDropdownOptions(this.workflowsStore);
  }

  onSelectSearch(term: string){
    this.isDropdownSelected = false;
    if (this.workflowsStore && this.workflowsStore.length === 1) {
      let url: string;
      this.selectedWorkflow = this.workflowsStore[0];
      this.graphId = this.selectedWorkflow.instanceId || this.selectedWorkflow.injectableName;
      this.updateCanvas();
      url =`/operationsCenter/workflowViewer?${this.isDefinition ? 'graphName': 'graphId'}=${this.graphId}`;
      this.gotoCanvas(url);
    } else {
      //Following search will be done among filtered workflows
      this.allWorkflows = _.cloneDeep(this.workflowsStore);
    }
  }

  onSearch(term: string, searchKey: string): void {
    this.searchField = searchKey;
    this.searchTerms.next(term);
  }

  onClear(){
    this.graphId = null;

    this.selectedWorkflow = null;
    this.allWorkflows = [];
    this.workflowsStore = [];

    this.isDropdownSelected = false;

    // this.isDefinition=false;
    this.searchField = null;
    if (this.searchSubscribe){
      this.searchSubscribe.unsubscribe();
    }

    this.clearCanvas();
    this.gotoCanvas("/operationsCenter/workflowViewer");
  }

  onChange(input: string, inputKey: string){
    //onChange is triggered before keyup by enter
    this.isDropdownSelected = true;
  }

  gotoCanvas(url: string){
    // Router doesn't trigger page reload in Angular5;
    // This is to change the navigator history
    this.router.navigateByUrl(url);
  }
}
