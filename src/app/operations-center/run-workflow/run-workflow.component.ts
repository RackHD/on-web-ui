import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringOperator } from '../../utils/inventory-operator';
import { Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { JSONEditor } from '../../utils/json-editor';
import { NodeService } from '../../services/rackhd/node.service';
import { GraphService } from '../../services/rackhd/graph.service';
import { WorkflowService } from '../../services/rackhd/workflow.service';
import { error } from 'util';

@Component({
  selector: 'app-run-workflow',
  templateUrl: './run-workflow.component.html',
  styleUrls: ['./run-workflow.component.scss']
})
export class RunWorkflowComponent implements OnInit {
  @ViewChild('jsoneditor') jsoneditor: ElementRef;
  injectableName: any;
  editor: any;
  runWorkflowRes = {
    title: "",
    note: "",
    type: 1
  };

  private searchTerms = new Subject<string>();
  showModal: boolean
  allWorkflows: any;
  workflows: any;
  selectedFriendlyName: any;
  selectedInjectableName: any;

  nodes: any;
  selectedNodeId: any;

  constructor(
    public nodeService: NodeService,
    public GraphService: GraphService,
    private activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private router: Router
  ) {}

  ngOnInit() {
    this.showModal = false;
    let container = this.jsoneditor.nativeElement;
    let options = {mode: 'code'};
    this.editor = new JSONEditor(container, options);
    this.getAllNodes();
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

    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.injectableName = queryParams.injectableName;
      if (this.injectableName) {
        this.getWorkflowByName();
      }
    });
  }

  /*get workflow by injectablename*/

  getWorkflowByName() {
    this.GraphService.getByIdentifier(this.injectableName).subscribe(data => {
      this.selectedFriendlyName = data[0].friendlyName;
      this.selectedInjectableName = data[0].injectableName;
      this.updateEditor(data[0]);
    });
  }

  /*get all workflow*/

  getworkflowStore() {
    this.GraphService.getAll().subscribe(graphs => {
      this.allWorkflows = graphs;
    });
  }

  getInitWorkflows() {
    if (_.isEmpty(this.allWorkflows)) {
      this.getworkflowStore();
    }
    this.workflows = this.allWorkflows && this.allWorkflows.slice(0, 10);
    if (this.injectableName) {
      this.router.navigate(['operationsCenter/runWorkflow']);
    }
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  searchIterm(term: string): void {
    if (_.isEmpty(this.allWorkflows)) {
      this.getworkflowStore();
    }
    this.workflows = StringOperator.search(term, this.allWorkflows).slice(0, 10);
  }

  putWorkflowIntoJson(name: any) {
    let workflow = {};
    for (let item of this.allWorkflows) {
      if (item.friendlyName.replace(/\s/ig, '') === name.replace(/\s/ig, '')) {
        workflow = item;
        this.selectedInjectableName = item.injectableName;
        break;
      }
    }
    if (workflow) {
      this.updateEditor(workflow);
    }
  }

  clearInput() {
    this.selectedFriendlyName = null;
    this.editor.set({});

  }

  updateEditor(workflow: any) {
    if (workflow.options)
      this.editor.set(workflow.options);
    else
      this.editor.set({});

  }

  getAllNodes() {
    this.nodeService.getAll()
      .subscribe(data => {
        this.nodes = data;
      });
  }

  runWorflow() {
    this.showModal = true;
    let payload = this.editor.get();
    if (_.isEmpty(this.selectedNodeId) || _.isEmpty(this.selectedFriendlyName) || _.isEmpty(payload)){
      this.runWorkflowRes = {
        title: "Run Workflow Failed!",
        note: "Please confirm if all necessary parameters are complete!",
        type: 2
      };
    }else {
      console.log(this.selectedNodeId, this.selectedInjectableName, payload);
      this.workflowService.runWorkflow(this.selectedNodeId, this.selectedInjectableName, payload)
        .subscribe(data => {
          console.log(data);
          this.runWorkflowRes = {
            title: "Run Workflow Successfully!",
            note: "The workflow has run successfully!",
            type: 1
          };
        },
          err => {
            console.log(err.error);
            this.runWorkflowRes = {
              title: "Run Workflow Failed!",
              note: err.error,
              type: 2
            };
          }
        );
    }
  }

}
