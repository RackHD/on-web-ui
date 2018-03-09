import { Component, OnInit } from '@angular/core';
import { OBM, Node } from 'app/models';
import { ObmService } from 'app/services/obm.service';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NodeService } from 'app/services/node.service';
import { AlphabeticalComparator, ObjectFilterByKey } from 'app/utils/inventory-operator';

import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'app-obm',
  templateUrl: './obm.component.html',
  styleUrls: ['./obm.component.scss']
})
export class ObmComponent implements OnInit {
  allObms: OBM[];
  dataStore: OBM[] = [];

  selectedObm: OBM[];
  isShowDetail: boolean;

  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No nodes found!';
  selectedPageSize = '15';

  allNodes: Node[];
  obmForm: FormGroup;
  updateForm: FormGroup;

  isCreateObm: boolean;
  isDelete: boolean;
  isUpdate: boolean;
  selectedObms: OBM[];
  updateObm: OBM;

  constructor(public obmsService: ObmService, public nodeService: NodeService,
    private fb: FormBuilder) { }

  public idComparator = new AlphabeticalComparator('id');
  public nodeComparator = new AlphabeticalComparator('node');
  public serviceComparator = new AlphabeticalComparator('service');
  public configComparator = new AlphabeticalComparator('config');

  public nodeFilter = new ObjectFilterByKey('node');
  public serviceFilter = new ObjectFilterByKey('service');
 
  ngOnInit() {
    this.getAllObms();
    this.getAllNodes();
    this.createForm();
    this.selectedObms = [];

    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchIterm(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
  }

  searchIterm(term: string): void {
    const datas = _.cloneDeep(this.dataStore);
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
    this.allObms = _.filter(datas, (data) => {
      return contains(data.id) || contains(data.node) ||
        contains(data.service) || contains(JSON.stringify(data.config));
    });
    this.dgDataLoading = false;
  }

  getAllObms(): void {
    this.obmsService.getAllObms()
      .subscribe(data => {
        this.allObms = data;
        this.dataStore = data;
        this.dgDataLoading = false;
      });
  }

  getAllNodes(): void {
    this.nodeService.getAllNodes()
      .subscribe(data => {
        this.allNodes = data;
      });
  }

  createForm() {
    this.obmForm = this.fb.group({
      nodeId: '',
      user: '',
      password: '',
      host: ''
    });

    this.updateForm = this.fb.group({
      nodeId: '',
      user: '',
      password: '',
      host: ''
    });
  }

  goToDetail(obm: OBM) {
    this.selectedObm = [obm];
    this.isShowDetail = true;
  }

  get dgPageSize() {
    return +this.selectedPageSize;
  }

  willUpdate(obm: OBM): void {
    this.updateObm = obm;
    this.updateForm.value['user'] = obm.config['user'];
    this.updateForm.value['host'] = obm.config['host'];
    this.isUpdate = true;
  }

  willDelete(obm?: OBM): void {
    if (obm) {
      this.selectedObms = [obm];
    }
    this.isDelete = true;
  }

  willCreateObm(): void {
    this.isCreateObm = true;
  }

  refreshDatagrid() {
    this.dgDataLoading = true;
    this.getAllObms();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  createObm(): void {
    this.create(this.obmForm);
  }

  create(form: FormGroup, nodeId?: string): void {
    let jsonData = {};
    let value = form.value;

    // data transform
    jsonData['service'] = 'ipmi-obm-service';
    jsonData['nodeId'] = nodeId ? nodeId : value['nodeId'];
    jsonData['config'] = {};
    jsonData['config']['user'] = value['user'];
    jsonData['config']['password'] = value['password'];
    jsonData['config']['host'] = value['host'];

    let postData = JSON.stringify(jsonData);
    this.obmsService.creatOneObm(postData)
      .subscribe(data => {
        this.refreshDatagrid();
      });
  }

  update() {
    let nodeSplit = this.updateObm.node.split('/');
    let nodeId = nodeSplit[nodeSplit.length - 1];
    this.create(this.updateForm, nodeId);
  }
  delete(): void {
    let res = this.obmsService.deleteObms(this.selectedObms);

    for (let entry of res) {
      entry.subscribe(() => {
        this.refreshDatagrid();
      });
    }
  }
}