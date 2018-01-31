import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { InventoryService } from '../services/inventory.service';
import {
  Device,
  DeviceType,
  SystemCapacity,
  DeviceStatus
} from './inventory.model';

import { DeviceTypeMap, DeviceStatusMap } from '../../config/inventory.config';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject }    from 'rxjs/Subject';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
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
  selectedStatus: string;
  selectedDevice: Device;

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = true;
  dgPlaceholder = 'No devices found!'
  selectedPageSize = '15';
  get dgPageSize(){
    return +this.selectedPageSize;
  }


  public nameComparator = new AlphabeticalComparator('name');
  public typeComparator = new AlphabeticalComparator('type');
  public provisionComparator = new AlphabeticalComparator('provisioned')
  public ipComparator = new IpComparator('ip')
  public serialNumberComparator = new AlphabeticalComparator('serialNumber');
  public statusComparator = new AlphabeticalComparator('status');
  public rackComparator = new AlphabeticalComparator('rack');
  public siteComparator = new AlphabeticalComparator('site');
  public telemetryDateComparator = new DateComparator('telemetryDate');
  public typeFilter = new GridStringFilter('type', this.deviceTypeMap);
  public statusFilter = new GridStringFilter('status', this.deviceStatusMap);
  typeFilterValue: string = this.selectedType;
  statusFilterValue: string = this.selectedStatus;

  shapeMap = {
    'compute': 'computer',
    'storage': 'data-cluster',
    'network': 'network-switch',
    'DD': 'storage',
    'HC/HCI': 'alarm-clock'
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public inventoryService: InventoryService,
    public router: Router,
    public changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    let self = this;
    // get device types list
    this.inventoryService.getDeviceTypes().subscribe(
      data => {
        this.deviceTypes = _.transform(
          data,
          function(result, item){
            let dt = new DeviceType();
            if(_.has(DeviceTypeMap, item)){
              dt.identifier = item;
              dt.displayName = DeviceTypeMap[item];
              result.push(dt);
            }
          },[]
        )
        this.deviceTypes.push({identifier: 'other', displayName: 'Other'});

        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
          let type = params.get('type');
          if(type){
            let dt = new DeviceType();
            dt.identifier = type;
            dt.displayName = DeviceTypeMap[type];
            this.selectType(dt);
          }
        })

        }
    );

    // get device status list
    this.inventoryService.getDeviceStatus().subscribe(
      data => this.deviceStatus = _.transform(
        data,
        function(result, item){
          let dt = new DeviceStatus();
          if(_.has(DeviceStatusMap, item)){
            dt.identifier = item;
            dt.displayName = DeviceStatusMap[item];
            result.push(dt);
          }
        },[]
      )
    )

    // set defult filter vaule
    // this.selectType(this.deviceTypes[0]);

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

  refreshDatagrid(){
    this.dgDataLoading = true;
    this.getAllDevices();
  }

  afterGetDevices() {
    this.devicesTypeCountMatrix = _.transform(this.allDevices, (result, item) => {
      let type = item.type;
      if (!_.has(DeviceTypeMap, type)) { type = 'other'; }
      result[type] ? result[type] += 1 : result[type] = 1;
    }, []);

    this.devicesStatusCountMatrix = _.transform(this.allDevices, (result, item) => {
      let status = item.status;
      result[status] ? result[status] += 1 : result[status] = 1;
    }, []);
  }

  // main data resourse
  getAllDevices() {
    return this.inventoryService.getAllDevices().toPromise().then(
      data => {
        this.allDevices = data
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

  selectType(type: DeviceType){
    this.selectedStatus = '';
    if(this.selectedType === type.displayName){
      this.selectedType = '';
    } else{
      //two types of filter.
      // type 1
      this.selectedType = type.displayName;
      // type 2
      // this.devices = this.devicesDataMatrix[type.identifier];
    }
    this.typeFilterValue = this.selectedType;
    this.statusFilterValue = this.selectedStatus;
    this.changeDetectorRef.detectChanges();
  }

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
    this.statusFilterValue = this.selectedStatus;
    this.changeDetectorRef.detectChanges();
  }

  goToDetail(device: Device){
    this.selectedDevice = device;
    console.log(this.activatedRoute)
    this.router.navigate(['device', device.serialNumber], {relativeTo: this.activatedRoute});
  }

}

class AlphabeticalComparator implements Comparator<Device> {
    sortBy: string;
    constructor(sortBy: string){
      this.sortBy = sortBy;
    }
    compare(a: Device, b: Device) {
        let sortedArray = _.sortBy([a, b], [ o => o[this.sortBy]]);
        return _.findIndex(sortedArray, a) - _.findIndex(sortedArray, b);
    }
}

class IpComparator implements Comparator<Device>{
    sortBy: string;
    constructor(sortBy: string){
      this.sortBy = sortBy;
    }
    compare(a: Device, b: Device) {
      let ipA = _.split(a.ip, '.');
      let ipB = _.split(b.ip, '.');
      for (let i = 0; i < 4; i++) {
        if(ipA[i] !== ipB[i]){
          return parseInt(ipA[i]) - parseInt(ipB[i]);
        }
      }
    }
}

class DateComparator implements Comparator<Device> {
    sortBy: string;
    constructor(sortBy: string){
      this.sortBy = sortBy;
    }
    compare(a: Device, b: Device) {
      return Number(a[this.sortBy]) - Number(b[this.sortBy]);
    }
}

class GridStringFilter implements StringFilter<Device> {
    filterBy: string;
    valueMap: any;
    constructor(filterBy: string, valueMap: any){
      this.filterBy = filterBy;
      this.valueMap = valueMap;
    }
    accepts(device: Device, search: string):boolean {
        if (!this.valueMap){
          return "" + device[this.filterBy] == search
              || device[this.filterBy].toLowerCase().indexOf(search) >= 0;
        }
        if(_.hasIn(this.valueMap, device[this.filterBy])){
          return "" + this.valueMap[device[this.filterBy]] == search
              || this.valueMap[device[this.filterBy]].toLowerCase().indexOf(search) >= 0;
        }
        if ( search === 'other'){
          return true;
        }
    }
}
