import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringOperator } from '../../utils/inventory-operator';
import { Subject } from 'rxjs/Rx';
import * as _ from 'lodash';
import { NODE_TYPES } from 'app/models';
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
  filteredNode: Array<any> = [];

  allNodeTypes: Array<any> = [];
  allNodeNames: Array<any> = [];
  allNodeObms: Array<any> = [];
  allNodeObmsName: Array<any> = [];
  allNodeSkus: Array<any> = [];
  allNodeSkusName: Array<any> = [];

  selectedNodeType: any;
  selectedNodeName: any;
  selectedNodeObm: any;
  selectedNodeSku: any;

  selectedNodeId: any;

  constructor(public nodeService: NodeService,
              public graphService: GraphService,
              private activatedRoute: ActivatedRoute,
              private workflowService: WorkflowService,
              private catalogsService: CatalogsService,
              private obmService: ObmService,
              private router: Router) {
  }

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
    if (this.filteredNode.length === 0) {
      this.nodeService.getAll()
        .subscribe(data => {
          this.allNodesInfo = data;
          console.log("allnodeinfo===", this.allNodesInfo);
          this.getAllNames();
          this.getAllSkus();
          this.getAllObms();
          this.getAllTypes();
        });
    } else {
      this.allNodesInfo = this.filteredNode;
      this.getAllNames();
      this.getAllSkus();
      this.getAllObms();
      this.getAllTypes();
    }
  }

  /* Get the nodes with sku
  *   1. there are some nodes without the property of sku. => filter them
  *   2. if the sku is not null,then getting its name.
  *   3. if the sku is null,
  *      then judegging if his node type is compute.=>if not, fitler them
  *   4. if the sku is null and its node type is compute,
  *      get its dmi.base_board.product_name by catalogs.
  **/
  getAllSkus() {
    let filterednodes;
    if (this.filteredNode.length === 0)
      filterednodes = this.allNodesInfo;
    else
      filterednodes = this.filteredNode;
    this.allNodeSkus = [];
    filterednodes.forEach(node => {
      if (node.hasOwnProperty('sku')) {
        if (node.sku !== null) {
          let nodeTemp = {id: node.id, name: node.sku.name};
          this.allNodeSkus.push(nodeTemp);
        } else if (node.sku === null) {
          if (node.type === "compute") {
            this.catalogsService.getSource(node.id, "ohai").subscribe(data => {
              let nodeTemp = {id: data.node, name: data.data.dmi.base_board.product_name};
              this.allNodeSkus.push(nodeTemp);
              this.allNodeSkusName = Array.from(new Set(_.map(this.allNodeSkus, 'name')));
            });
          }
        }
      }
    });
    console.log("all skus ==== ", this.allNodeSkus.length, this.allNodeSkus);
    // console.log("all skus ==== ", this.allNodeSkusName.length, this.allNodeSkusName);
  }

  getAllNames() {
    this.allNodeNames = [];
    let filterednodes;
    if (this.filteredNode.length === 0)
      filterednodes = this.allNodesInfo;
    else
      filterednodes = this.filteredNode;
    this.allNodeNames = _.map(filterednodes, 'name');
    console.log("all names ==== ", this.allNodeNames.length, this.allNodeNames);
  }

  getAllObms() {
    let filterednodes;
    if (this.filteredNode.length === 0)
      filterednodes = this.allNodesInfo;
    else
      filterednodes = this.filteredNode;
    let obmInfo = [];
    this.allNodeObms = [];
    filterednodes.forEach(node => {
      /* Get the nodes with obms*/
      if (node.obms.length > 0) {
        let obm = {id: node.id, obmId: node.obms[0].ref.split("/").pop()}
        obmInfo.push(obm);
      }
    });
    /* Get the host of obms*/
    if (obmInfo.length > 0) {
      obmInfo.forEach(value => {
        this.obmService.getByIdentifier(value.obmId).subscribe(data => {
          let obmTemp = {id: value.id, name: data.config.host};
          this.allNodeObms.push(obmTemp);
          this.allNodeObmsName = Array.from(new Set(_.map(this.allNodeObms, 'name')));
        });
      });
    }
    // console.log("all obms ==== ", this.allNodeObmsName.length, this.allNodeObmsName);
    console.log("all obms ==== ", this.allNodeObms.length, this.allNodeObms);
  }

  getAllTypes() {
    this.allNodeTypes = [];
    let filterednodes;
    if (this.filteredNode.length === 0) {
      NODE_TYPES.forEach(type => {
        this.allNodeTypes.push(_.upperFirst(type));
      });
    } else {
      this.filteredNode.forEach(node => {
        this.allNodeTypes.push(_.upperFirst(node.type));
      });
    }
    this.allNodeTypes = Array.from(new Set(this.allNodeTypes));
    console.log("all types ==== ", this.allNodeTypes.length, this.allNodeTypes);
  }

  getNodeByIdentifier(type, value) {
    console.log("filter===>", this.filteredNode);
    let filterednodes;
    if (this.filteredNode.length === 0)
      filterednodes = this.allNodesInfo;
    else
      filterednodes = this.filteredNode;
    switch (type) {
      case 'nodetype':
        this.filteredNode = _.filter(filterednodes, _.matches({'type': _.lowerFirst(value)}));
        break;
      case 'nodename':
        this.filteredNode = _.filter(filterednodes, _.matches({'name': value}));
        break;
      case 'nodeobm':
        let filterObmTemp = _.filter(this.allNodeObms, _.matches({'name': value}));
        let obmTemp = [];
        filterObmTemp.forEach(data => {
          for (let node of this.filteredNode) {
            if (node.id == data.id)
              obmTemp.push(data)
          }
        })
        this.filteredNode = obmTemp;
        break;
      case 'nodesku':
        let filterSkuTemp = _.filter(this.allNodeSkus, _.matches({'name': value}));
        console.log("第一次筛选sku：", filterSkuTemp);
        let skuTemp = [];
        filterSkuTemp.forEach(data => {
          for (let node of this.filteredNode) {
            if (node.id == data.id)
              skuTemp.push(data)
          }
        })
        this.filteredNode = skuTemp;
        break;
    }
    // this.filteredNode = Array.from(new Set(this.filteredNode));
    console.log("筛选之后的node信息", this.filteredNode.length, this.filteredNode);
    if (this.filteredNode.length === 1) {
      this.selectedNodeId = this.filteredNode[0].id;
      this.selectedNodeType = _.upperFirst(this.filteredNode[0].type);
      this.selectedNodeName = this.filteredNode[0].name;
      if (this.filteredNode[0].obms.length > 0)
        this.selectedNodeObm = _.filter(this.allNodeObms, _.matches({'id': this.filteredNode[0].id}))[0].name;
      if (this.filteredNode[0].hasOwnProperty('sku')) {
        this.selectedNodeSku = _.filter(this.allNodeSkus, _.matches({'id': this.filteredNode[0].id}))[0].name;
      }
    } else {
      this.getAllNodes();
    }
  }

  clearNodeInput() {
    this.selectedNodeId = null;
    this.selectedNodeType = null;
    this.selectedNodeName = null;
    this.selectedNodeObm = null;
    this.selectedNodeSku = null;
    this.filteredNode = [];
    this.getAllNodes();
  }

  clearOption(e) {
    console.log(e.keyCode);
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
