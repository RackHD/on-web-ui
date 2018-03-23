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
import 'rxjs/add/operator/mergeMap'
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

import { AlphabeticalComparator, StringOperator, ObjectFilterByKey } from '../../utils/inventory-operator';

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
  searchTerms = new Subject<string>();
  workflowsStore: Workflow[];
  allWorkflows: Workflow[];

  filterForm: FormGroup;
  constructor(private route: ActivatedRoute, private workflowService: WorkflowService) {
  }

  ngOnInit() {
    this.route.queryParams
    .subscribe(params => {
      this.graphId = params && params.graphId;
    });
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchWorkflow(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
    this.createFormGroup();
  }

  ngAfterViewInit() {
    if (!this.graphId) {return;}
    this.updateGraphStatus();
    this.updateFormValue();
  }

  createFormGroup(){
    this.filterForm = new FormGroup({
      graphId: new FormControl(''),
      node: new FormControl(''),
      graphName: new FormControl('')
    });
  }

  updateFormValue(){
    if (this.selectedWorkflow){
      this.filterForm.patchValue({
        graphId: this.selectedWorkflow.instanceId,
        node: this.selectedWorkflow.node,
        graphName: this.selectedWorkflow.name
      });
    }
  }

  updateGraphStatus(){
    this.workflowService.getByIdentifier(this.graphId)
    .subscribe(workflowData => {
      this.selectedWorkflow = _.cloneDeep(workflowData);
      // workflowData.waitOn = _.transform(workflowData.tasks, (result, value, key) => {
        // result[value.instanceId] = {
          // waitingOn: value.waitingOn
        // }
      // }, {});
      this.onWorkflowInput.emit(_.cloneDeep(workflowData));
    });
  }

  searchWorkflow(term: string): void{
    this.workflowsStore = StringOperator.search(term, this.allWorkflows);
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }
}
