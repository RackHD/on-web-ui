import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  ViewChild,
} from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { WorkflowService } from 'app/services/rackhd/workflow.service';
import { Workflow, Graph } from 'app/models';
import { GraphService } from 'app/services/rackhd/graph.service';

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
  allWorkflows: any[] = [];

  fieldList: string[] = [];
  labelList: string[] = [];
  offsetList: number[] = [];
  columnList : number[] = [];
  widthList : number[] = [];

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
    this.fieldList = this.isDefinition ? ["injectableName", "friendlyName"] : ["instanceId", "name", "node"];
    this.labelList = this.isDefinition ? ["InjectableName", "FriendlyName"] : ["GraphId", "Name", "Node"];
    this.offsetList = this.isDefinition ? [0, 0] : [0, 0, 0];
    this.columnList = this.isDefinition ? [5, 5] : [4, 4, 3];
    this.widthList = this.isDefinition ? [47, 47] : [42, 47, 28];
  }

  ngAfterViewInit() {
    if(this.graphId) {
      this.service.getByIdentifier(this.graphId)
      .subscribe(workflowData => {
        this.selectedWorkflow = (workflowData instanceof Array) ? workflowData[0] : workflowData;
        this.allWorkflows = [this.selectedWorkflow];
        this.onWorkflowInput.emit(this.selectedWorkflow);
      });
    } else {
      this.getAllWorkflows();
    }
  }

  getAllWorkflows() {
    this.service.getAll()
    .subscribe(workflows=> {
      this.allWorkflows = workflows;
    });
  }

  updateCanvas(url: string): void {
    this.onWorkflowInput.emit(this.selectedWorkflow);
    if (url) {
      // This router doesn't trigger page reload in Angular5;
      // This is only to change the navigator history
      this.router.navigateByUrl(url);
    };
  }

  onSelected(workflow: Workflow) {
    this.selectedWorkflow = workflow;
    this.graphId = this.selectedWorkflow.instanceId || this.selectedWorkflow.injectableName;
    let url = `/operationsCenter/workflowViewer?${this.isDefinition ? 'graphName': 'graphId'}=${this.graphId}`;
    this.updateCanvas(url);
  }

  onRefresh(item: string) {
    this.selectedWorkflow = {};
    this.updateCanvas('/operationsCenter/workflowViewer');
    this.getAllWorkflows();
  }
}
