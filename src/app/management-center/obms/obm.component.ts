import { Component, OnInit } from '@angular/core';
import { OBM, Node } from 'app/models';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlphabeticalComparator, ObjectFilterByKey, StringOperator } from 'app/utils/inventory-operator';

import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ObmService } from 'app/services/rackhd/obm.service';
import { NodeService } from 'app/services/rackhd/node.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-obm',
  templateUrl: './obm.component.html',
  styleUrls: ['./obm.component.scss']
})
export class ObmComponent implements OnInit {
  obmStore: OBM[];
  allObms: OBM[] = [];

  selectedObm: OBM;
  isShowDetail: boolean;
  action: string;
  rawData: string;
  isShowModal: boolean;

  dgDataLoading = false;
  dgPlaceholder = 'No nodes found!';

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
  }

  onFilter(filtered): void {
    this.obmStore = filtered;
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Create':
        this.isCreateObm = true;
        break;
      case 'Delete':
        this.batchDelete();
        break;
    };
  }

  getAllObms(): void {
    this.obmsService.getAll()
      .subscribe(data => {
        this.obmStore = data;
        this.allObms = data;
        this.dgDataLoading = false;
      });
  }

  getAllNodes(): void {
    this.nodeService.getAll()
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
    this.selectedObm = obm;
    this.isShowDetail = true;
  }

  getChild(objKey: string, obm: OBM){
    this.selectedObm = obm;
    this.action = _.capitalize(objKey);
    this.rawData = obm && obm[objKey];
    this.isShowModal = true;
  }

  willUpdate(obm: OBM): void {
    this.updateObm = obm;
    this.updateForm.value['user'] = obm.config['user'];
    this.updateForm.value['host'] = obm.config['host'];
    this.isUpdate = true;
  }

  batchDelete(obm?: OBM): void {
    if (obm) {
      this.selectedObms = [obm];
    }
    this.isDelete = true;
  }


  refresh() {
    this.dgDataLoading = true;
    this.getAllObms();
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

    this.obmsService.creatObm(jsonData)
      .subscribe(data => {
        this.refresh();
      });
  }

  update() {
    let nodeSplit = this.updateObm.node.split('/');
    let nodeId = nodeSplit[nodeSplit.length - 1];
    this.create(this.updateForm, nodeId);
  }

  delete(): void {
    let list = [];
    _.forEach(this.selectedObms, obm => {
      list.push(obm.id);
    });

    this.obmsService.deleteByIdentifiers(list)
    .subscribe(results =>{
      this.refresh();
    });
  }
}
