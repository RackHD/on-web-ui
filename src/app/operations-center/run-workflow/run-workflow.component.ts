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
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/of';

import * as _ from 'lodash';

@Component({
  selector: 'app-run-workflow',
  templateUrl: './run-workflow.component.html',
  styleUrls: ['./run-workflow.component.scss']
})
export class RunWorkflowComponent implements OnInit, AfterViewInit {
  @ViewChild('jsoneditor') jsoneditor: ElementRef;
  editor: any;
  runWorkflowRes = {
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

  filterFields = ["type", "name", "sku", "obms", 'tags'];
  filterLabels = ["Node Type", "Node Name", "Node SKU Name", "Node OBM Host", "Node Tag Name"];
  filterColumns = [4, 4, 4, 4, 4];

  nodeFields = ["id"];
  nodeLabels = ["Node: "];
  nodeColumns = [3];
  selectedNode: any;

  graphFields = ["friendlyName"];
  graphLabels = ["Graph: "];
  graphColumns = [3];

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
    } else {
      this.getAllWorkflows();
    }
    this.getAllNodes();
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

  clearGraphInput() {
    this.graphId = '';
    this.selectedGraph = {};
    this.graphStore = [];
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
      .map(data => data.name);
    } else if (isComputeWithoutSku) {
      return this.catalogsService.getSource(node.id, "ohai")
      .map(data => data.data.dmi.base_board.product_name);
    } else {
      return Observable.of(null);
    }
  }

  getNodeObm(node): Observable<string> {
    if (!_.isEmpty(node.obms)) {
      let obmId = node.obms[0].ref.split("/").pop();
      return this.obmService.getByIdentifier(obmId)
      .map(data => data.config.host);
    } else {
      return Observable.of(null);
    }
  }

  getNodeTag(node): Observable<string> {
    if (!_.isEmpty(node.tags)) {
      return this.tagService.getTagByNodeId(node.id)
      .map(data => {
        if(_.isEmpty(data)) { return null; }
        return data.attributes.name;
      });
    } else {
      return Observable.of(null);
    }
  }

  renderNodeInfo(nodes) {
    let list = _.map(nodes, node => {
      return Observable.forkJoin(this.getNodeSku(node), this.getNodeObm(node), this.getNodeTag(node))
      .map(results => {
        node["sku"] = results[0];
        node["obms"] = results[1];
        node["tags"] = results[2];
      });
    });

    Observable.forkJoin(list)
    .subscribe((data) => {
      this.allNodes = _.cloneDeep(nodes);
      this.nodeStore = _.cloneDeep(nodes);
      this.selNodeStore = _.cloneDeep(nodes);
    });
  }

  postWorflow() {
    this.showModal = true;
    let payload = this.editor.get();
    let selectedNodeId = this.selectedNode && this.selectedNode.id;
    this.graphId = this.graphId || this.selectedGraph.injectableName; 
    this.workflowService.runWorkflow(selectedNodeId, this.graphId, payload)
    .subscribe(
      data => {
        this.graphId = data.instanceId;
        this.runWorkflowRes = {
          title: "Post Workflow Successfully!",
          note: "The workflow has post successfully!  Do you want to view it now?",
          type: 1
        };
      },
      err => {
        this.runWorkflowRes = {
          title: "Post Workflow Failed!",
          note: err.error,
          type: 2
        };
      }
    );
  }

  goToViewer() {
    this.showModal = false;
    this.router.navigate(['operationsCenter/workflowViewer'], {
      queryParams: {graphId: this.graphId}
    });
  }

  onGraphSelect(graph){
    console.log(graph);
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
    this.selNodeStore = [node];
  };

  onFilterRefresh() {
    this.selNodeStore= [];
    this.nodeStore = _.cloneDeep(this.allNodes);
  }

  onNodeSelect(node){
    this.selectedNode = node;
    this.nodeStore = [node];
  };

  onNodeRefresh() {
    this.nodeStore = [];
    setTimeout(()=>{
      this.nodeStore = _.cloneDeep(this.allNodes);
    });
  }

  onReset(){
    this.selNodeStore= [];
    this.nodeStore = [];
    setTimeout(()=>{
      this.nodeStore = _.cloneDeep(this.allNodes);
      this.selNodeStore = _.cloneDeep(this.allNodes);
    });
  }
}
