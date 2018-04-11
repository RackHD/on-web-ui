import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringOperator } from '../../utils/inventory-operator';
import { Subject } from 'rxjs/Rx';
import { WorkflowService } from '../services/workflow.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { JSONEditor } from '../../utils/json-editor';
import { NodeService } from '../../services/node.service';

@Component({
  selector: 'app-run-workflow',
  templateUrl: './run-workflow.component.html',
  styleUrls: ['./run-workflow.component.scss']
})
export class RunWorkflowComponent implements OnInit {
  @ViewChild('jsoneditor') jsoneditor: ElementRef;
  injectableName: any;
  editor: any;

  private searchTerms = new Subject<string>();
  workflowStore: any;
  workflows: any;
  inputValue: any;

  // nodeTypes: any;
  nodes: any;
  inputNodeValue: any;
  nodetypePlaceholder: any;

  constructor(public workflowService: WorkflowService,
              public nodeService: NodeService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    let container = this.jsoneditor.nativeElement;
    let options = {mode: 'code'};
    this.editor = new JSONEditor(container, options);
    this.getAllNodes();
    this.getworkflowStore();
    // this.getAllNodesType();

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
    this.workflowService.getWorkflow(this.injectableName).subscribe(data => {
      this.inputValue = data[0].friendlyName;
      this.updateEditor(data);
    });
  }

  /*get all workflow*/

  getworkflowStore() {
    this.workflowService.getWorkflow().subscribe(graphs => {
      this.workflowStore = graphs;
    });
  }

  getInitTasks() {
    if (!this.workflowStore) {
      this.getworkflowStore();
    }
    this.workflows = this.workflowStore && this.workflowStore.slice(0, 10);
    if (this.injectableName) {
      this.router.navigate(['operationsCenter/runWorkflow']);
    }
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  searchIterm(term: string): void {
    if (!this.workflowStore) {
      this.getworkflowStore();
    }
    this.workflows = StringOperator.search(term, this.workflowStore).slice(0, 10);
  }

  putWorkflowIntoJson(name: any) {
    let workflow = {};
    for (let item of this.workflowStore) {
      if (item['friendlyName'] === name) {
        workflow = item;
        break;
      }
    }
    if (workflow) {
      this.updateEditor(workflow);
    }
  }

  clearInput() {
    this.inputValue = null;
    this.editor.set({});

  }

  updateEditor(workflow: any) {
    this.editor.set(workflow);
  }

  // getAllNodesType(): void {
  //   this.nodeService.getNodeTypes()
  //     .subscribe(data => {
  //       console.log("type===", data);
  //       this.nodeTypes = data;
  //     });
  // }

  getAllNodes() {
    this.nodeService.getAllNodes()
      .subscribe(data => {
        this.nodes = data;
      });
  }

  // getNodeInforById(id) {
  //   console.log(id);
  //   this.nodeService.getNodeById(id)
  //     .subscribe(data => {
  //       console.log(data);
  //     });
  // }
}
