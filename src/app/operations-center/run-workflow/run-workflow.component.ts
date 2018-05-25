import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Rx';
import { JSONEditor } from 'app/utils/json-editor';

import { NodeService } from 'app/services/rackhd/node.service';
import { GraphService } from 'app/services/rackhd/graph.service';
import { WorkflowService } from 'app/services/rackhd/workflow.service';
import { CatalogsService } from 'app/services/rackhd/catalogs.service';
import { ObmService } from 'app/services/rackhd/obm.service';
import { SkusService } from 'app/services/rackhd/sku.service';
import { TagService } from 'app/services/rackhd/tag.service';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { map, catchError } from 'rxjs/operators';

import * as _ from 'lodash';

@Component({
  selector: 'app-run-workflow',
  templateUrl: './run-workflow.component.html',
  styleUrls: ['./run-workflow.component.scss']
})
export class RunWorkflowComponent implements OnInit, AfterViewInit {
  @ViewChild('jsoneditor') jsoneditor: ElementRef;
  editor: any;
  modalInformation = {
    title: "",
    note: "",
    type: 1
  };
  showModal: boolean;

  graphId: string;
  graphStore: any[] = [];
  allGraphs: any[] = [];
  selectedGraph: any;

  allNodes: Array<any> = [];
  nodeStore: Array<any> = [];
  selNodeStore: any [] = [];
  selectedNode: any;

  filterFields = ["type", "name", "sku", "id", "obms", 'tags'];
  filterLabels = ["Node Type", "Node Name", "SKU Name", "Node ID", "OBM Host", "Tag Name"];
  filterColumns = [4, 4, 4, 4, 4, 4];

  constructor(
    public nodeService: NodeService,
    public graphService: GraphService,
    private activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private catalogsService: CatalogsService,
    private obmService: ObmService,
    public skuService: SkusService,
    public tagService: TagService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.graphId = queryParams.injectableName;
    });
    this.showModal = false;
    let container = this.jsoneditor.nativeElement;
    let options = {mode: 'code'};
    this.editor = new JSONEditor(container, options);
    this.getAllWorkflows();
  }

  ngAfterViewInit() {
    if (this.graphId) {
      this.selWorkflowById(this.graphId);
    }
    this.getAllNodes();
  }

  resetModalInfo() {
    this.modalInformation = {
      title: "",
      note: "",
      type: 1
    };
  }

  selWorkflowById(id) {
    this.graphService.getByIdentifier(id)
    .subscribe(data => {
      this.selectedGraph = (data instanceof Array) ? data[0] : data;
      this.graphStore = [this.selectedGraph];
      this.updateEditor(data.options);
    });
  }

  getAllWorkflows() {
    this.graphService.getAll()
    .subscribe(graphs => {
      this.allGraphs = graphs;
      this.graphStore = _.cloneDeep(graphs);
    });
  }

  updateEditor(options: any) {
    if (options)
      this.editor.set(options);
    else
      this.editor.set({});
  }

  getAllNodes() {
    this.nodeService.getAll()
    .subscribe(data => {
      this.renderNodeInfo(data);
    });
  }

  getNodeSku(node): Observable<string> {
    let hasSkuId = !!node.sku;
    let isComputeWithoutSku = (node.sku === null) && node.type === "compute";
    if (hasSkuId) {
      return this.skuService.getByIdentifier(node.sku.split("/").pop())
      .pipe(map(data => data.name));
    } else if (isComputeWithoutSku) {
      return this.catalogsService.getSource(node.id, "ohai")
      .pipe(map(data => data.data.dmi.base_board.product_name));
    } else {
      return of(null);
    }
  }

  getNodeObm(node): Observable<string> {
    if (!_.isEmpty(node.obms)) {
      let obmId = node.obms[0].ref.split("/").pop();
      return this.obmService.getByIdentifier(obmId)
      .pipe(map(data => data.config.host));
    } else {
      return of(null);
    }
  }

  getNodeTag(node): Observable<string> {
    if (!_.isEmpty(node.tags)) {
      return this.tagService.getTagByNodeId(node.id)
      .pipe(
        map(data => {
          if (_.isEmpty(data)) { return null; }
          return data.attributes.name;
        })
      );
    } else {
      return of(null);
    }
  }

  renderNodeInfo(nodes) {
    let list = _.map(nodes, node => {
      return forkJoin(
        this.getNodeSku(node).pipe(catchError( () => of(null))),
        this.getNodeObm(node).pipe(catchError( () => of(null))),
        this.getNodeTag(node).pipe(catchError( () => of(null)))
      ).pipe(
          map(results => {
            node["sku"] = results[0];
            node["obms"] = results[1];
            node["tags"] = results[2];
          })
      );
    });

    forkJoin(list)
    .subscribe((data) => {
      this.allNodes = _.cloneDeep(nodes);
      this.nodeStore = _.cloneDeep(nodes);
      this.selNodeStore = _.cloneDeep(nodes);
    });
  }

  goToRunWorkflow() {
    this.showModal = true;
    let selectedNodeId = this.selectedNode && this.selectedNode.id;
    this.graphId = this.graphId || this.selectedGraph.injectableName;
    let subNote;
    if (selectedNodeId)
      subNote = `with ${selectedNodeId}`;
    else
      subNote = `without node`;
    this.modalInformation = {
      title: "Reminder",
      note: `Are you sure to run workflow ${this.graphId} ${subNote}`,
      type: 1
    };
  }

  postWorkflow() {
    let payload = this.editor.get();
    let selectedNodeId = this.selectedNode && this.selectedNode.id;
    this.graphId = this.graphId || this.selectedGraph.injectableName;
    this.workflowService.runWorkflow(selectedNodeId, this.graphId, payload)
    .subscribe(
      data => {
        this.graphId = data.instanceId;
        this.modalInformation = {
          title: "Post Workflow Successfully!",
          note: "The workflow has post successfully! Do you want to check the status of the running workflow?",
          type: 2
        };
      },
      err => { this.showModal = false; }
    );
   }

  goToViewer() {
    this.resetModalInfo();
    this.showModal = false;
    this.router.navigate(['operationsCenter/workflowViewer'], {
      queryParams: {graphId: this.graphId}
    });
  }

  onGraphSelect(graph){
    this.selectedGraph = graph;
    this.updateEditor(this.selectedGraph.options);
  };

  onGraphRefresh() {
    this.selectedGraph = null;
    this.graphStore = _.cloneDeep(this.allGraphs);
    this.updateEditor({});
    this.router.navigateByUrl('operationsCenter/runWorkflow');
  }

  onFilterSelect(node){
    this.selectedNode = node;
    if (this.selNodeStore.length === 1 && _.isEqual(this.selNodeStore[0], node)) return;
    setTimeout( () => this.selNodeStore = [node]);
  };

  onFilterRefresh(item: string) {
    this.selNodeStore= [];
    setTimeout(() => {
      this.nodeStore = _.cloneDeep(this.allNodes);
      this.selNodeStore = _.cloneDeep(this.allNodes);
    });
  }

  onNodeSelect(node){
    this.selectedNode = node;
    if (this.nodeStore.length === 1 && _.isEqual(this.nodeStore[0], node)) return;
    setTimeout( () => this.nodeStore = [node]);
  };

  onReset(){
    this.selNodeStore = [];
    this.nodeStore = [];
    setTimeout(() => {
      this.nodeStore = _.cloneDeep(this.allNodes);
      this.selNodeStore = _.cloneDeep(this.allNodes);
    });
  }
}
