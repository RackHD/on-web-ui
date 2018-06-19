import { Component, OnInit } from '@angular/core';
import { OBM, Node, OBM_TYPES } from 'app/models';

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
  selectedObms: OBM[];
  obmTypes: string[] = [];
  selObmService: any;

  action: string;
  rawData: string;
  isShowModal: boolean;

  dgDataLoading = false;
  dgPlaceholder = 'No OBM found!';

  allNodes: Node[] = [];
  selNodeId: string;

  obmForm: FormGroup;

  configFields: string[];

  get obmMetaList() {
    return OBM_TYPES;
  }

  constructor(
    public obmsService: ObmService,
    public nodeService: NodeService,
    private fb: FormBuilder
  ) { }

  public idComparator = new AlphabeticalComparator('id');
  public nodeComparator = new AlphabeticalComparator('node');
  public serviceComparator = new AlphabeticalComparator('service');
  public configComparator = new AlphabeticalComparator('config');

  public nodeFilter = new ObjectFilterByKey('node');
  public serviceFilter = new ObjectFilterByKey('service');

  ngOnInit() {
    this.getAllObms();
    this.getAllNodes();
    this.obmTypes = _.sortBy(_.keys(this.obmMetaList));
    this.createForm();
    this.selectedObms = [];
  }

  onFilter(filtered): void {
    this.obmStore = filtered;
  }

  onConfirm(value) {
    switch(value) {
      case 'reject':
        this.isShowModal = false;
        break;
      case 'accept':
        this.isShowModal = false;
        this.deleteSel();
    }
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Create':
        this.action = 'create';
        this.isShowModal = true;
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

  goToDetail(obm: OBM) {
    this.selectedObm = obm;
    this.action = "detail";
    this.isShowModal = true;
  }

  getChild(objKey: string, obm: OBM){
    this.selectedObm = obm;
    this.action = _.capitalize(objKey);
    this.rawData = obm && obm[objKey];
    this.action = "Config";
    this.isShowModal = true;
  }

  batchDelete(obm?: OBM): void {
    if (obm) {
      this.selectedObms = [obm];
    }
    this.action = "delete";
    this.isShowModal = true;
  }


  refresh() {
    this.dgDataLoading = true;
    this.getAllObms();
  }

  createForm(){
    this.obmForm = this.fb.group({
      service: {value: '', validators: [Validators.required, Validators.minLength(1)]},
      nodeId: {value: '', validators: [Validators.required, Validators.minLength(25), Validators.maxLength(25)]}
    });
  }

  updateFormInputs(service: string) {
    this.selObmService = this.obmMetaList[service];
    let config = this.selObmService.config
    this.configFields = _.keys(config);
    _.forEach(this.configFields, field => {
      this.obmForm.addControl(field, new FormControl('', Validators.required));
    });
  }

  onServiceSelected(){
    let service = this.obmForm.value.service;
    if(service) {
      this.updateFormInputs(service);
    }
  }

  onNodeSelected(node){
    this.selNodeId = node.id;
  }

  onNodeClear(){
    this.selNodeId = null;
  }

  onUpsert(): void {
    let values = this.obmForm.value;
    let payload =  {
      nodeId: this.selNodeId,
      service: values.service,
      config: {}
    }
    delete values.service;
    delete values.nodeId;
    if (values.port) values.port = parseInt(values.port);
    _.merge(payload.config, values);
    this.obmsService.creatObm(payload)
    .subscribe(data => {
      this.refresh();
      this.selNodeId = null;
    });
  }

  closeUpsertModal() {
    _.forEach(_.keys(this.obmForm.value), field => {
      if (field === 'nodeId' || field === 'service') return true;
      this.obmForm.removeControl(field);
    });
    this.configFields = [];
    this.selObmService = null;
    this.obmForm.reset();
    this.isShowModal = false;
  }

  onUpdate(obm: OBM) {
    this.updateFormInputs(obm.service);
    this.selNodeId = obm.node.split("/").pop();
    let formValues = {
      service: obm.service,
      nodeId: this.selNodeId
    }
    _.merge(formValues, obm.config);
    this.obmForm.patchValue(formValues);
    this.isShowModal = true
    this.action = "update";
  }

  willDelete(obm){
    this.selectedObms = [obm];
    this.action = "delete";
    this.isShowModal = true;
  }

  deleteSel(): void {
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
