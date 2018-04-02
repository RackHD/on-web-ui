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
import { Workflow } from '../../models';

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

  selectedWorkflow: any;
  workflowsStore: Workflow[];
  allWorkflows: Workflow[];

  filterForm: FormGroup;
  isDropdownSelected: boolean;
  isFocused: boolean;
  dropDownList: string[];

  isDefinition: boolean = false; // true: graph definition; false: graph object
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
      debounceTime(500),
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
    });
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
    if (this.isDropdownSelected) {
      // For dropdown selection, skip popup of dropDownList;
      return this.onSelectSearch(term);
    }
    if (this.isFocused){
      this.workflowsStore = _.cloneDeep(this.allWorkflows);
      this.isFocused = false;
    } else {
      let excludeFields = _.without(_.keys(this.allWorkflows[0]), this.searchField);
      this.workflowsStore = StringOperator.search(term, this.allWorkflows, excludeFields);
    }

    this.dropDownList = this.getFilteredList();
  }

  onSelectSearch(term: string){
    this.isDropdownSelected = false;
    let excludeFields = _.without(_.keys(this.allWorkflows[0]), this.searchField);
    this.workflowsStore = StringOperator.search(term, this.allWorkflows, excludeFields);
    this.dropDownList = [];
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

  getFilteredList(){
    let filteredValues = [];
    _.forEach(this.workflowsStore, (workflow) => {
      let value = workflow[this.searchField];
      if (!_.includes(filteredValues, value)){
        filteredValues.push(value);
      }
    });
    return filteredValues;
  }

  onSearch(term: string, searchKey: string): void {
    this.searchField = searchKey;
    this.searchTerms.next(term);
  }

  onFocus(inputKey: string): void {
    //onFocused is to prefetch all valid workflows
    this.isFocused = true;
    this.searchField = inputKey;
    this.searchTerms.next(inputKey);
  }

  onClear(){
    this.graphId = null;

    this.selectedWorkflow = null;
    this.allWorkflows = [];
    this.workflowsStore = [];

    this.isDropdownSelected = false;
    this.isFocused = false;
    this.dropDownList =[];

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
