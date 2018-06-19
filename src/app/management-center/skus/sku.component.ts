import { Component, OnInit } from '@angular/core';
import { SKU, ModalTypes } from 'app/models';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlphabeticalComparator, ObjectFilterByKey, StringOperator, isJsonTextValid } from 'app/utils/inventory-operator';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { SkusService } from 'app/services/rackhd/sku.service';
import {isEmbeddedView} from "@angular/core/src/view/util";


@Component({
  selector: 'app-sku',
  templateUrl: './sku.component.html',
  styleUrls: ['./sku.component.scss']
})

export class SkuComponent implements OnInit {
  skuStore: SKU[] = [];
  allSkus: SKU[] = [];

  selectedSku: SKU;
  isShowDetail: boolean;
  isShowModal: boolean;
  rawData: any;
  action: any;

  dgDataLoading = false;
  dgPlaceholder = 'No SKU found!';

  isCreateSku: boolean;
  isDelete: boolean;
  selectedSkus: SKU[];
  isSkuOnly: boolean;

  skuForm: FormGroup;
  skuPackFiles: FileList;

  defaultRules: string = ' ' ;
  rulesJsonValid = true;
  optionsJsonValid = true;
  modalTypes: ModalTypes;
  updateTheSku  = false;

  constructor(public skusService: SkusService, private fb: FormBuilder) { }

  public idComparator = new AlphabeticalComparator('id');
  public discoveryGraphNameComparator = new AlphabeticalComparator('discoveryGraphName');
  public nameComparator = new AlphabeticalComparator('name');

  public nameFilter = new ObjectFilterByKey('name');
  public discoveryGraphNameFilter = new ObjectFilterByKey('discoveryGraphName');

  ngOnInit() {
    this.modalTypes = new ModalTypes(['Rules', 'Sku Config', 'Discovery Graph Options']);
    this.getAllSkus();
    this.createForm();
    this.selectedSkus = [];
    this.isSkuOnly = false;
  }

  onFilter(filtered): void {
    this.skuStore = filtered;
  }

  onConfirm(value) {
    switch(value) {
      case 'reject':
        this.isDelete = false;
        break;
      case 'accept':
        this.isDelete = false;
        this.deleteSel();
    }
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Create':
        this.create();
        break;
      case 'Delete':
        this.batchDelete();
        break;
    };
  }

  createForm() {
    this.skuForm = this.fb.group({
      name: new FormControl('', { validators: [Validators.required] }),
      discoveryGraphName: '',
      discoveryGraphOptions: '',
      rules:new FormControl('', { validators: [Validators.required] })
    });
  }

  onRadioChange(){
    this.isSkuOnly = !this.isSkuOnly;
  }

  getAllSkus(): void {
    this.skusService.getAll()
      .subscribe( data => {
        this.skuStore = data;
        this.allSkus = data;
        this.dgDataLoading = false;
      });
  }

  goToDetail(sku: SKU) {
    this.selectedSku = sku;
    this.isShowDetail = true;
  }

  getChild(objKey: string, sku: SKU){
    this.selectedSku = sku;
    this.action = _.startCase(objKey);
    this.rawData = sku && sku[objKey];
    if (this.selectedSku && this.action && (!_.isEmpty(this.rawData)))
      this.isShowModal = true;
  }

  create(): void {
    this.isCreateSku = true;
    this.isSkuOnly = false;
    this.updateTheSku = false;
    this.createForm();

  }

  willUpdate(sku: SKU): void {
    this.rulesJsonValid = true;
    this.optionsJsonValid = true;
    let name = sku.name;
    let rules = sku.rules;
    let formValues = {
      name: name,
      discoveryGraphName: sku.discoveryGraphName,
      rules: JSON.stringify(rules),
      discoveryGraphOptions: JSON.stringify(sku.discoveryGraphOptions)
    }
    this.skuForm.patchValue(formValues);
    this.isCreateSku = true;
    this.isSkuOnly = true;
    this.updateTheSku = true;
  }

  batchDelete(): void {
    if(!_.isEmpty(this.selectedSkus)){
      this.isDelete = true;
    }
  }

  willDelete(sku: SKU): void {
    this.selectedSkus = [sku];
    this.isDelete = true;
  }

  refresh() {
    this.dgDataLoading = true;
    this.getAllSkus();
  }

  onChange(event){
    this.skuPackFiles = event.target.files;
  }

  createSku(): void {
    let jsonData = {};
    this.skuForm.getRawValue();
    let value = this.skuForm.value;
    // data transform
    jsonData['name'] = value['name'];
    //TODO: name is required;
    if(value['discoveryGraphName']){
      jsonData['discoveryGraphName'] = value['discoveryGraphName'];
    }
    this.rulesJsonValid = isJsonTextValid(value['rules']);
    this.optionsJsonValid = isJsonTextValid(value['discoveryGraphOptions']);
    if (this.rulesJsonValid) {
      jsonData['rules'] = value['rules'] ? JSON.parse(value['rules']) : [];
      let self = this;
      if(_.isEmpty(jsonData['rules'])){
        self.rulesJsonValid = false;
      }
      _.forEach(_.map(jsonData['rules'], 'path'), function (item) {
          if(_.isUndefined(item)){
            self.rulesJsonValid = false;
          }
      })
    }
    if (this.optionsJsonValid) {
      let data = value['discoveryGraphOptions']  && JSON.parse(value['discoveryGraphOptions']);
      if(!_.isEmpty(data)){
        jsonData['discoveryGraphOptions'] = data;
      }
    }
    if (this.rulesJsonValid && this.optionsJsonValid && this.skuForm.get('name').valid) {
      this.isCreateSku = false;
      if(this.updateTheSku === true){
        this.updateTheSku = false;
        this.skusService.updateSku(jsonData)
          .subscribe(data => {
            this.refresh();
          })
      } else {
        this.skusService.createSku(jsonData)
          .subscribe(data => {
            this.refresh();
          });
      }

    }
  }

  createSkupack(): void {
    this.isCreateSku = false;
    let file = this.skuPackFiles[0];
    let identifier = this.selectedSkus.length && this.selectedSku['id'];
    this.skusService.uploadByPost(file, identifier)
    .subscribe(() => {
      this.refresh();
    });
  }

  deleteSel(): void {
    let list = [];
    _.forEach(this.selectedSkus, sku => {
      list.push(sku.id);
    });

    this.skusService.deleteByIdentifiers(list)
    .subscribe(results =>{
      this.refresh();
    });
  }
}
