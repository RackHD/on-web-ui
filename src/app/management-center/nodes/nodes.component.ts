import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Comparator, StringFilter } from "@clr/angular";

import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { NODE_TYPE_MAP } from '../../../config/rackhd.config';
import { NodeService } from '../../services/node.service';
import { Node, NodeType, NodeStatus } from '../../models/node';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NodesComponent implements OnInit {
  allNodes: Node[] = [];
  nodesStore: Node[] = [];

  nodeTypes: NodeType[];
  nodesDataMatrix = {};
  nodesTypeCountMatrix = {};
  nodesStatusDataMatrix = {};
  nodesStatusCountMatrix = {};

  selectedType: string;
  selectedSku: string;
  selectedNode: Node;
  selectedNodes: Node[];
  isShowDetail: boolean;
  isShowObmDetail: boolean;

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No nodes found!'
  selectedPageSize = '15';

  get dgPageSize() {
    return +this.selectedPageSize;
  }

  public nameComparator = new AlphabeticalComparator('name');
  public idComparator = new AlphabeticalComparator('id');
  public typeComparator = new AlphabeticalComparator('type');
  public skuComparator = new AlphabeticalComparator('sku');
  public autoDiscoverComparator = new AlphabeticalComparator('autoDiscover');
  public identifiersComparator = new AlphabeticalComparator('identifiers');
  public discoveredTimeComparator = new DateComparator('discoveredTime');
  public typeFilter = new ObjectFilterByKey('type');
  public skuFilter = new ObjectFilterByKey('sku');
  typeFilterValue: string = this.selectedType;
  skuFilterValue: string = this.selectedSku;

  shapeMap = {
    'compute': 'computer',
    'storage': 'data-cluster',
    'network': 'network-switch'
  }

  constructor(public activatedRoute: ActivatedRoute,
    public router: Router,
    public changeDetectorRef: ChangeDetectorRef,
    public nodeService: NodeService) {
  }

  ngOnInit() {
    let self = this;
    this.nodeService.getNodeTypes().subscribe(
      data => {
        this.nodeTypes = _.transform(
          data,
          function (result, item) {
            let dt = new NodeType();
            if (_.has(NODE_TYPE_MAP, item)) {
              dt.identifier = item;
              dt.displayName = NODE_TYPE_MAP[item];
              result.push(dt);
            }
          }, []);
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
          let type = params.get('type');
          if (type) {
            let dt = new NodeType();
            dt.identifier = type;
            dt.displayName = NODE_TYPE_MAP[type];
            this.selectType(dt);
          }
        });
      }
    );

    this.selectedNodes = [];

    // get all nodes directly or concat all nodes of different types
    this.getAllNodes();

    let searchTrigger = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        this.searchNodes(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  refreshDatagrid() {
    this.dgDataLoading = true;
    this.getAllNodes();
  }

  afterGetNodes() {
    this.nodesTypeCountMatrix = _.transform(this.allNodes, (result, item) => {
      let type = item.type;
      if (!_.has(NODE_TYPE_MAP, type)) {
        type = 'other';
      }
      result[type] ? result[type] += 1 : result[type] = 1;
    }, []);
  }

  // main data resourse
  getAllNodes(): void {
    this.nodeService.getAllNodes()
      .subscribe(data => {
        this.allNodes = data;
        this.nodesStore = data;
        this.dgDataLoading = false;
        this.afterGetNodes();
      });
  }

  searchNodes(term: string): void {
    const nodes = _.cloneDeep(this.nodesStore);
    function contains(src: string): boolean {
      if (!src) {
        return false;
      }
      if (!term) {
        return true;
      }
      return src.toLowerCase().includes(term.toLowerCase());
    }
    this.dgDataLoading = true;
    this.allNodes = _.filter(nodes, (node) => {
      return contains(node.name) ||
        contains(NODE_TYPE_MAP[node.type]);
    });
    this.dgDataLoading = false;
    this.afterGetNodes();
  }

  selectType(type: NodeType) {
    if (this.selectedType === type.displayName) {
      this.selectedType = '';
    } else {
      //two types of filter.
      // type 1
      this.selectedType = type.displayName;
      // type 2
      // this.nodes = this.nodesDataMatrix[type.identifier];
    }
    this.typeFilterValue = this.selectedType;
    this.changeDetectorRef.detectChanges();
  }

  goToDetail(node: Node) {
    this.selectedNode = node;
    this.isShowDetail = true;
  }

  goToShowObmDetail(node: Node) {
    this.selectedNode = node;
    this.isShowObmDetail = true;
  }
}

class AlphabeticalComparator implements Comparator<Node> {
  sortBy: string;

  constructor(sortBy: string) {
    this.sortBy = sortBy;
  }

  compare(a: Node, b: Node) {
    let sortedArray = _.sortBy([a, b], [o => o[this.sortBy]]);
    return _.findIndex(sortedArray, a) - _.findIndex(sortedArray, b);
  }
}

class DateComparator implements Comparator<Node> {
  sortBy: string;

  constructor(sortBy: string) {
    this.sortBy = sortBy;
  }

  compare(a: Node, b: Node) {
    return Number(a[this.sortBy]) - Number(b[this.sortBy]);
  }
}

///////////////////////////////////////////////////////////////////
//
// Filter for specific field of a Obj
//
// Usage:  if you want to filter Event by ID, then new ObjectFilterByKey<Event>('ID').
///////////////////////////////////////////////////////////////////
export class ObjectFilterByKey<T> implements StringFilter<T> {
  private _field: string;

  constructor(field: string) {
    this._field = field;
  }

  accepts(obj: T, searchKey: string): boolean {
    if (!obj || !obj[this._field]) {
      return false;
    }
    if (typeof (obj[this._field]) !== 'string') {
      console.error(`Error,Only accept string in ObjectFilterByKey for: ${obj.constructor.name}[${this._field}].`);
      return false;
    }
    return obj[this._field].toLowerCase().indexOf(searchKey) >= 0;
  }
}
