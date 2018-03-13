import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AlphabeticalComparator, StringOperator, ObjectFilterByKey} from '../../utils/inventory-operator';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import * as _ from 'lodash';

import { ConfigService } from '../services/config.service';
import { Config, PAGE_SIZE_OPTIONS} from '../../models';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent implements OnInit {
  configStore: Config[] = [];
  allConfig: Config[] = [];
  selectedConfig: Config;

  modalAction: string;
  isShowModal: boolean;
  modalFormGroup: FormGroup;
  isShowUpdateStatus: boolean;
  configureType: string;

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No configure found!'
  selectedPageSize = "15";
  pageSizes = PAGE_SIZE_OPTIONS;

  public keyComparator = new AlphabeticalComparator<Config>('key');
  public keyFilter = new ObjectFilterByKey<Config>('key');
  public valueFilter = new ObjectFilterByKey<Config>('value');

  get dgPageSize() {
    return parseInt(this.selectedPageSize);
  }

  constructor(private configService: ConfigService) { }

  ngOnInit() {
    this.getAllConfig();
    this.modalFormGroup = new FormGroup({
      key: new FormControl(''),
      value: new FormControl('')
    });
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchConfig(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
  }

  getAllConfig(): void {
    this.configService.getAll()
      .subscribe(data => {
        let _data = [];
        _.forEach(_.keys(data), (key) => {
          //Remove unnecessary enviroment configures
          if (key.match("^[a-z].*")) {
            _data.push({key: key, value: data[key]})
          }
        })
        this.configStore = _data;
        this.allConfig = _data;
        this.dgDataLoading = false;
      });
  }

  searchConfig(term: string){
    this.dgDataLoading = true;
    this.configStore = StringOperator.search(term, this.allConfig, ["key", "value"]);
    this.dgDataLoading = false;
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  onRefresh() {
    this.dgDataLoading = true;
    this.getAllConfig();
  }

  onUpdate(item: Config) {
    this.isShowUpdateStatus = true;
    this.selectedConfig = item;
    this.configureType = typeof item.value;
    //Configure values can be string, number or object;
    let value = (this.configureType === "object")
      ? JSON.stringify(this.selectedConfig.value)
      : this.selectedConfig.value;
    this.modalFormGroup.setValue({key: item.key, value: value});
    this.modalAction = "Update";
    this.isShowModal = true;
  };

  onCreate() {
    this.isShowUpdateStatus = true;
    this.selectedConfig = {key: null, value: null};
    this.modalFormGroup.setValue({key: null, value: null});
    this.modalAction = "Create";
    this.isShowModal = true;
  };

  onDelete() {};

  onBatchDelete() {};

  onGetDetails() {};

  onGetRawData() {};

  getHttpMethod(){
    if (this.modalAction === "Create") { return "put";}
    if (this.modalAction === "Update") { return "patch";}
  };

  onSubmit(){
    let key: any = this.modalFormGroup.get("key").value;
    let value: any = this.modalFormGroup.get("value").value;
    let method: string = this.getHttpMethod();
    if (this.configureType === "number") {
      value = parseInt(value);
    } else if(this.configureType === "object"){
      value = JSON.parse(value);
    }
    let payload = {};
    payload[key] = value;
    this.configService[method](payload)
    .subscribe( data => {
      this.selectedConfig.key = key;
      this.selectedConfig.value = data[this.selectedConfig.key];
      this.isShowUpdateStatus = false;
      this.onRefresh();
    });
  }
}
