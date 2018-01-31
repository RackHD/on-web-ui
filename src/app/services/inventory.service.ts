import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';

import {
  Device,
  DeviceType,
  SystemCapacity,
  mockDeviceTypes,
  mockDevices,
  mockDeviceStatus
} from '../inventory/inventory.model';

import { DeviceTypeMap, DeviceStatusMap } from '../../config/inventory.config';


@Injectable()
export class InventoryService {
  constructor() {}

  getDeviceTypes(): Observable<string[]> {
    return Observable.of(mockDeviceTypes).delay(500);
  }

  getDeviceStatus(): Observable<string[]> {
    return Observable.of(mockDeviceStatus).delay(500);
  }

  getAllDevices(): Observable<Device[]> {
    return Observable.of(mockDevices).delay(500);
  }

  getDevicesFromType(type: string): Observable<Device[]> {
    return Observable.of(mockDevices)
      .pipe(
        map((devices) => _.filter(devices, (device) => device.type === type))
      )
      .delay(500);
  }

  inverseGetDeviceFromTypes(types: string[]): Observable<Device[]>{
    return Observable.of(mockDevices)
      .pipe(
        map((devices) => _.filter(devices, (device) => _.indexOf(types, device.type) === -1))
      )
      .delay(500);
  }

  getDeviceFromSerialNumber(sn: string){
    return Observable.of(mockDevices)
      .pipe(map((devices) => _.find(devices, (device) => device.serialNumber === sn)))
      .delay(500);
  }
  getDeviceByRackID(rackID: string): Observable<Device[]>{
    return Observable.of(mockDevices)
      .pipe(
        map((devices) => _.filter(devices, (device) =>  device.rack === rackID))
      )
      .delay(500);
  }
  getAllRacks(): Observable<any>{
    let ret = _.countBy(mockDevices, 'rack'); // e.x:{'1':12,'2':14,'3':5};
    return Observable.of(ret)
      .delay(100);
  }

  searchDevices(term: string){
    function contains(src: string): boolean{
      if(!src) {return false};
      return src.toLowerCase().includes(term.toLowerCase());
    }
    return Observable.of(
      _.filter(mockDevices, (device) => {
        return contains(device.name) ||
          contains(DeviceTypeMap[device.type]) ||
          contains(device.serialNumber) ||
          contains(DeviceStatusMap[device.status]) ||
          contains('rack'+device.rack) ||
          contains(device.site) ||
          contains(device.telemetryDate.toString()) ||
          contains(device.ip) ||
          contains(''+device.provisioned)
      })
    ).delay(500);
  }

}
