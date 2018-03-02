import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import { Device, DeviceStatus, DeviceType } from './inventory.model';

import { DeviceStatusMap, DeviceTypeMap } from '../../config/inventory.config';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InventoryListComponent implements OnInit {
  deviceTypes: DeviceType[];
  deviceStatus: DeviceStatus[];
  allDevices: Device[] = [];
  devicesDataMatrix = {};
  devicesTypeCountMatrix = {};
  devicesStatusDataMatrix = {};
  devicesStatusCountMatrix = {};
  deviceTypeMap = DeviceTypeMap;
  deviceStatusMap = DeviceStatusMap;

  selectedType: string;
  selectedSku: string;
  selectedStatus: string;
  selectedDevice: Device [];

  selectedDevices: Device [];

  isShowDetail: boolean;

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = true;
  dgPlaceholder = 'No devices found!'
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
              public inventoryService: InventoryService,
              public router: Router,
              public changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    let self = this;
    // get device types list
    this.inventoryService.getDeviceTypes().subscribe(
      data => {
        this.deviceTypes = _.transform(
          data,
          function (result, item) {
            let dt = new DeviceType();
            if (_.has(DeviceTypeMap, item)) {
              dt.identifier = item;
              dt.displayName = DeviceTypeMap[item];
              result.push(dt);
            }
          }, []
        )
        //this.deviceTypes.push({identifier: 'other', displayName: 'Other'}); 
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
          let type = params.get('type');
          if (type) {
            let dt = new DeviceType();
            dt.identifier = type;
            dt.displayName = DeviceTypeMap[type];
            this.selectType(dt);
          }
        })

      }
    );

    this.selectedDevices = [];

    // get all devices directly
    // or concat all devices of different types
    this.getAllDevices();

    let searchTrigger = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => {
        return this.searchDevices(term);
      })
    );
    searchTrigger.subscribe();

  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  refreshDatagrid() {
    this.dgDataLoading = true;
    this.getAllDevices();
  }

  afterGetDevices() {
    this.devicesTypeCountMatrix = _.transform(this.allDevices, (result, item) => {
      let type = item.type;
      if (!_.has(DeviceTypeMap, type)) {
        type = 'other';
      }
      result[type] ? result[type] += 1 : result[type] = 1;
    }, []);
    /*
    this.devicesStatusCountMatrix = _.transform(this.allDevices, (result, item) => {
      let status = item.status;
      result[status] ? result[status] += 1 : result[status] = 1;
    }, []);
     */
  }

  // main data resourse
  getAllDevices() {
    return this.inventoryService.getAllDevices().toPromise().then(
      data => {
        this.allDevices = data;
        console.log(this.allDevices);
        this.dgDataLoading = false;
        this.afterGetDevices();
      }
    );
  }

  searchDevices(term: string) {
    this.dgDataLoading = true;
    return this.inventoryService.searchDevices(term).toPromise().then(
      data => {
        this.allDevices = data
        this.dgDataLoading = false;
        this.afterGetDevices();
      }
    );
  }

  selectType(type: DeviceType) {
    this.selectedStatus = '';
    if (this.selectedType === type.displayName) {
      this.selectedType = '';
    } else {
      //two types of filter.
      // type 1
      this.selectedType = type.displayName;
      // type 2
      // this.devices = this.devicesDataMatrix[type.identifier];
    }
    this.typeFilterValue = this.selectedType;
    //this.statusFilterValue = this.selectedStatus;
    this.changeDetectorRef.detectChanges();
  }

  /*
  selectStatus(status: DeviceStatus){
    this.selectedType = '';
    if(this.selectedStatus === status.displayName){
      this.selectedStatus = '';
    } else{
      //two types of filter.
      // type 1
      this.selectedStatus = status.displayName;
      // type 2
      // this.devices = this.devicesDataMatrix[type.identifier];
    }
    this.typeFilterValue = this.selectedType;
    //this.statusFilterValue = this.selectedStatus;
    this.changeDetectorRef.detectChanges();
  }
   */

  goToDetail(device: Device) {
    this.selectedDevice = [device];
    this.isShowDetail = true;
    console.log(this.activatedRoute)
    //this.router.navigate(['device', device.id], {relativeTo: this.activatedRoute});
  }

}

class AlphabeticalComparator implements Comparator<Device> {
  sortBy: string;

  constructor(sortBy: string) {
    this.sortBy = sortBy;
  }

  compare(a: Device, b: Device) {
    let sortedArray = _.sortBy([a, b], [o => o[this.sortBy]]);
    return _.findIndex(sortedArray, a) - _.findIndex(sortedArray, b);
  }
}


class DateComparator implements Comparator<Device> {
  sortBy: string;

  constructor(sortBy: string) {
    this.sortBy = sortBy;
  }

  compare(a: Device, b: Device) {
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
    if (typeof(obj[this._field]) !== 'string') {
      console.error(`Error,Only accept string in ObjectFilterByKey for: ${obj.constructor.name}[${this._field}].`);
      return false;
    }
    return obj[this._field].toLowerCase().indexOf(searchKey) >= 0;
  }
}

