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
import { CatalogsService } from '../../services/rackhd/catalogs.service';
import { ObmService } from '../../services/rackhd/obm.service';

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
  showModal: boolean;
  allgraphs: any;
  workflows: any;
  selectedFriendlyName: any;
  selectedInjectableName: any;

  allNodesInfo: Array<any> = [];
  skuList = [];
  obmsList = [];
  nameList = [];
  typeList = [];
  selectedNodeStore: Array<any> = [];

  selectedNodeType: any;
  selectedNodeName: any;
  selectedNodeObm: any;
  selectedNodeSku: any;
  selectedNodeId: any;

  constructor(
    public nodeService: NodeService,
    public graphService: GraphService,
    private activatedRoute: ActivatedRoute,
    private workflowService: WorkflowService,
    private catalogsService: CatalogsService,
    private obmService: ObmService,
    private router: Router) {}

  ngOnInit() {
    this.showModal = false;
    let container = this.jsoneditor.nativeElement;
    let options = {mode: 'code'};
    this.editor = new JSONEditor(container, options);
    this.getAllNodes();
    this.getAllWorkflows();
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
    this.graphService.getByIdentifier(this.injectableName).subscribe(data => {
      this.selectedFriendlyName = data[0].friendlyName;
      this.selectedInjectableName = data[0].injectableName;
      this.updateOptionsEditor(data[0]);
    });
  }

  /*get all workflow*/

  getAllWorkflows() {
    this.graphService.getAll().subscribe(graphs => {
      this.allgraphs = graphs;
    });
  }

  getInitWorkflows() {
    if (_.isEmpty(this.allgraphs)) {
      this.getAllWorkflows();
    }
    this.workflows = this.allgraphs && this.allgraphs.slice(0, 10);
    if (this.injectableName) {
      this.router.navigate(['operationsCenter/runWorkflow']);
    }
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  searchIterm(term: string): void {
    if (_.isEmpty(this.allgraphs)) {
      this.getAllWorkflows();
    }
    this.workflows = StringOperator.search(term, this.allgraphs).slice(0, 10);
  }

  putWorkflowIntoJson(name: any) {
    let workflow = {};
    for (let item of this.allgraphs) {
      if (item.friendlyName.replace(/\s/ig, '') === name.replace(/\s/ig, '')) {
        workflow = item;
        this.selectedInjectableName = item.injectableName;
        break;
      }
    }
    if (workflow) {
      this.updateOptionsEditor(workflow);
    }
  }

  updateOptionsEditor(workflow: any) {
    if (workflow.options)
      this.editor.set(workflow.options);
    else
      this.editor.set({});
  }

  clearGraphInput() {
    this.selectedFriendlyName = null;
    this.editor.set({});
  }

  /* some opertions about node*/

  getAllNodes() {
    this.nodeService.getAll()
      .subscribe(data => {
        this.allNodesInfo = data;
        this.getAllLists(this.allNodesInfo);
      });
  }

  getAllLists(nodesStore) {
    this.skuList = [];
    this.obmsList = [];
    this.nameList = [];
    this.typeList = [];
    nodesStore.forEach(node => {
      /* get sku name
      *   1. there are some nodes without the property of sku. => filter them
      *   2. if the sku is not null,then getting its name.
      *   3. if the sku is null,
      *      then judegging if his node type is compute.=>if not, fitler them
      *   4. if the sku is null and its node type is compute,
      *      get its dmi.base_board.product_name by catalogs.
      **/
      if (node.hasOwnProperty('sku')) {
        if (node.sku === null) {
          if (node.type === "compute") {
            this.catalogsService.getSource(node.id, "ohai").subscribe(data => {
              node.sku = data.data.dmi.base_board.product_name;
              this.skuList.push(node.sku);
              this.skuList = Array.from(new Set(this.skuList));
            });
          } else {
            this.skuList = Array.from(new Set(this.skuList));
          }
        } else {
          this.skuList.push(node.sku);
          this.skuList = Array.from(new Set(this.skuList));
        }
      }
      /* get obms name*/
      if (node.obms instanceof Array) {
        if (node.obms.length > 0) {
          let obmsId = node.obms[0].ref.split("/").pop();
          this.obmService.getByIdentifier(obmsId).subscribe(data => {
            node.obms = data.config.host;
            this.obmsList.push(node.obms);
          });
          this.obmsList = Array.from(new Set(this.obmsList));
        } else {
          node.obms = null;
        }
      } else if (node.obms !== null) {
        this.obmsList.push(node.obms);
        this.obmsList = Array.from(new Set(this.obmsList));
      }
      /* get node name*/
      this.nameList.push(node.name);
      this.nameList = Array.from(new Set(this.nameList));
      /* get node type*/
      this.typeList.push(node.type);
      this.typeList = Array.from(new Set(this.typeList));
    });
  }

  getNodeByIdentifier(type, value) {
    let identifier = {};
    identifier[type] = value;
    this.selectedNodeStore = this.selectedNodeStore.length > 0 ? this.selectedNodeStore : this.allNodesInfo;
    this.selectedNodeStore = _.filter(this.selectedNodeStore, _.matches(identifier));
    /* refresh all list*/
    this.getAllLists(this.selectedNodeStore);
    /* to show the information if there is one element in selectedNodeStore  */
    if (this.selectedNodeStore.length === 1) {
      this.selectedNodeId = this.selectedNodeStore[0].id;
      this.selectedNodeType = this.selectedNodeStore[0].type;
      this.selectedNodeName = this.selectedNodeStore[0].name;
      this.selectedNodeObm = this.selectedNodeStore[0].obms;
      if (this.selectedNodeStore[0].hasOwnProperty('sku')) {
        this.selectedNodeSku = this.selectedNodeStore[0].sku;
      }
    }
  }

  clearNodeInput() {
    this.selectedNodeId = null;
    this.selectedNodeType = null;
    this.selectedNodeName = null;
    this.selectedNodeObm = null;
    this.selectedNodeSku = null;
    this.selectedNodeStore = [];
    this.getAllNodes();
  }

  postWorflow() {
    this.showModal = true;
    let payload = this.editor.get();
    if (_.isEmpty(this.selectedNodeId) || _.isEmpty(this.selectedFriendlyName) || _.isEmpty(payload)) {
      this.runWorkflowRes = {
        title: "Post Workflow Failed!",
        note: "Please confirm if all necessary parameters are complete!",
        type: 2
      };
    } else {
      this.workflowService.runWorkflow(this.selectedNodeId, this.selectedInjectableName, payload)
        .subscribe(data => {
            this.runWorkflowRes = {
              title: "Post Workflow Successfully!",
              note: "The workflow has run successfully!",
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
  }

}
