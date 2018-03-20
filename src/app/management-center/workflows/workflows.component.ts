import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AlphabeticalComparator, StringOperator, ObjectFilterByKey } from '../../utils/inventory-operator';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import * as _ from 'lodash';

import { GraphService } from '../services/graph.service';
import { Graph, PAGE_SIZE_OPTIONS } from '../../models';

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
  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No workflow found!'
  selectedPageSize = "15";
  pageSizes = PAGE_SIZE_OPTIONS;

  public friendlyNameComparator = new AlphabeticalComparator<Graph>('friendlyName');
  public injectableNameComparator = new AlphabeticalComparator<Graph>('injectableName');

  public friendlyNameFilter = new ObjectFilterByKey<Graph>('friendlyName');
  public injectableNameFilter = new ObjectFilterByKey<Graph>('injectableName');
  public optionsFilter = new ObjectFilterByKey<Graph>('options');
  public tasksFilter = new ObjectFilterByKey<Graph>('tasks');

  get dgPageSize() {
    return parseInt(this.selectedPageSize);
  }

  constructor(private workflowService: GraphService) { }

  ngOnInit() {
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

  //getRawData(identifier: string): void {}

  upsertGraph(payload: object): void {
    this.workflowService.put(payload, 'text')
    .subscribe(data => {
      this.isShowModal = false;
    })
  }

  searchWorkflow(term: string){
    this.dgDataLoading = true;
    this.workflowsStore = StringOperator.search(term,this.allWorkflows);
    this.dgDataLoading = false;
  }

  getHttpMethod(){
  }

  getChild(objKey: string, workflow: Graph){
    this.selectedWorkflow = workflow;
    this.action = _.capitalize(objKey);
    this.rawData = workflow && workflow[objKey];
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

  onRefresh() {
    this.isShowModal = false;
    this.dgDataLoading = true;
    this.getAll();
  }

  onBatchDelete() {
    if (!_.isEmpty(this.selectedWorkflows)){
      this.action = "Delete";
      this.isShowModal = true;
    }
  };

  onCreate(){
    this.createFormGroup();
    this.action = "Create";
    this.isShowModal = true;
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
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
  }

  onDeleteSubmit(){
    _.map(this.selectedWorkflows, workflow => {
      this.workflowService.remove(workflow.injectableName).subscribe(
        data =>{
          this.onRefresh();
        },
        error => {
          alert(error);
        }
      )
    })
  }
  // onCreateSubmit(){}

  onSubmit(){
    let payload = this.modalFormGroup.value;
    payload.options = _.isEmpty(payload.options) ? {} : JSON.parse(payload.options);
    payload.tasks = _.isEmpty(payload.tasks) ? [] : JSON.parse(payload.tasks);
    this.upsertGraph(payload);
  }
}
