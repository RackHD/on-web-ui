import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { InventoryService } from '../services/inventory.service';
import { Device } from './inventory.model';

import { DeviceTypeMap, DeviceStatusMap } from '../../config/inventory.config';
import { Comparator, StringFilter } from "clarity-angular";
import * as _ from 'lodash';



@Component({
  selector: 'app-inventory-list',
  templateUrl: './device-detail.component.html',
  styleUrls: ['./device-detail.component.scss']
})

export class DeviceDetailComponent implements OnInit {
  device: Device;
  deviceTypeMap = DeviceTypeMap;
  deviceStatusMap = DeviceStatusMap;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public inventoryService: InventoryService,
    public location: Location
  ){}

  ngOnInit(){
    this.route.paramMap
      .switchMap((params: ParamMap) =>
        this.inventoryService.getDeviceFromSerialNumber(params.get('serialNumber')))
        .subscribe(data => {
          this.device = data
        });
  }

  goBack(): void {
    this.location.back();
  }

}
