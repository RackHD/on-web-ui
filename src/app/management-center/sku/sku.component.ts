import { Component, OnInit } from '@angular/core';
import { SKU } from 'app/models/sku';
import { SkusService } from 'app/services/sku.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlphabeticalComparator, ObjectFilterByKey } from 'app/utils/inventory-operator';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'app-sku',
  templateUrl: './sku.component.html',
  styleUrls: ['./sku.component.scss']
})

export class SkuComponent implements OnInit {
  allSkus: SKU[] = [];
  dataStore: SKU[] = [];

  selectedSku: SKU[];
  isShowDetail: boolean;

  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No nodes found!';
  selectedPageSize = '15';

  isCreateSku: boolean;
  isDelete: boolean;
  selectedSkus: SKU[];

  skuForm: FormGroup;

  defaultRules: string = ' ' ;

  constructor(public skusService: SkusService, private fb: FormBuilder) { }

  public idComparator = new AlphabeticalComparator('id');
  public discoveryGraphNameComparator = new AlphabeticalComparator('discoveryGraphName');
  public nameComparator = new AlphabeticalComparator('name');

  public nameFilter = new ObjectFilterByKey('name');
  public discoveryGraphNameFilter = new ObjectFilterByKey('discoveryGraphName');

  ngOnInit() {
    this.getAllSkus();
    this.createForm();
    this.selectedSkus = [];

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
    this.allSkus = _.filter(datas, (data) => {
      return contains(data.id) || contains(data.name) ||
        contains(data.discoveryGraphName);
    });
    this.dgDataLoading = false;
  }

  createForm() {
    this.skuForm = this.fb.group({
      name: '',
      discoveryGraphName: '',
      rules: '',
      discoveryGraphOptions: ''
    });
  }

  getAllSkus(): void {
    this.skusService.getAllSkus()
      .subscribe( data => {
        this.allSkus = data;
        this.dataStore = data;
        this.dgDataLoading = false;
      });
  }

  goToDetail(sku: SKU) {
    this.selectedSku = [sku];
    this.isShowDetail = true;
  }

  get dgPageSize() {
    return +this.selectedPageSize;
  }

  willCreateSku(): void {
    this.isCreateSku = true;
  }

  willUpdate(sku: SKU): void {
    // TODO
  }

  willDelete(sku?: SKU): void {
    if (sku) {
      this.selectedSkus = [sku];
    }
    this.isDelete = true;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  refreshDatagrid() {
    this.dgDataLoading = true;
    this.getAllSkus();
  }
  
  createSku(): void {
    let jsonData = {};
    let value = this.skuForm.value;

    // data transform
    jsonData['name'] = value['name'];
    jsonData['discoveryGraphName'] = value['discoveryGraphName'];
    jsonData['rules'] = value['rules'] ? JSON.parse(value['rules']) : [];
    jsonData['discoveryGraphOptions'] = value['discoveryGraphOptions'] ?
    JSON.parse(value['discoveryGraphOptions']) : {};

    let postData = JSON.stringify(jsonData);
    this.skusService.creatOneSku(postData)
      .subscribe(data => {
        this.refreshDatagrid();
      });
  }

  delete(): void {
    let res = this.skusService.deleteSkus(this.selectedSkus);
    for (let entry of res) {
      entry.subscribe(() => {
        this.refreshDatagrid();
      });
    }
  }
}
