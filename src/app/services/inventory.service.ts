import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import * as _ from 'lodash';

import {
  Device,
  DeviceType,
  SystemCapacity,
  DeviceTypes,
  mockDevices,
  mockDeviceStatus
} from '../inventory/inventory.model';

import { DeviceTypeMap, DeviceStatusMap } from '../../config/inventory.config';


@Injectable()
export class InventoryService {
  constructor() {}

  getDeviceTypes(): Observable<string[]> {
    return Observable.of(DeviceTypes).delay(500);
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

  searchDevices(term: string){
    function contains(src: string): boolean{
      if(!src) {return false};
      return src.toLowerCase().includes(term.toLowerCase());
    }
    return Observable.of(
      _.filter(mockDevices, (device) => {
        return contains(device.name) ||
          contains(DeviceTypeMap[device.type])
          /*
          contains(device.telemetryDate.toString()) ||
          contains(device.ip) ||
          contains(''+device.provisioned)*/
      })
    ).delay(500);
  }

}
