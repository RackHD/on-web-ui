import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import * as _ from 'lodash';

import { Device  } from './inventory.model';
import { InventoryService } from '../services/inventory.service';

//structure for UI drawing
class NodeonRack{
    position: number; // the position in rack: u
    height: number; // 1u ,2u, 3u...
    name: string;   // device name
    deviceSN: string; // index to Devices
    type:string;
    constructor(data: any){
       _.assign(this, data);}
}


@Component({
    selector: 'app-rack-view',
    templateUrl: './rack-view.component.html',
    styleUrls: ['./rack-view.component.scss']
})
export class RackViewComponent implements OnInit {

    rackID:number; // from route.params
    rackHeight = 42;
    rackUnit = _.range(this.rackHeight);
    rackLayout : NodeonRack[]=[];
    allRacks: any[]=[];
    warnMessage="";
    loading = true;
    ///////////////////////////////////////////////////
    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public inventoryService: InventoryService,
    ){
    }

    ///////////////////////////////////////////////////
    static randomRBG(startOffset:number=0, endOffset:number=255){
        return "rgb("+_.random(startOffset,endOffset)
                 +","+_.random(startOffset,endOffset)
                 +","+_.random(startOffset,endOffset)+")";
    }
    readonly deviceTypeColorMap={
        'compute': '#00ccff',
        'storage': '#ff9900',
        'network': '#009999',
        'DD'     : '#800000',
        'HC/HCI' : '#996633',
        'default': '#000099'
    };

    ///////////////////////////////////////////////////
    buildRackLayout( devices:Device[],
                     rackID:number ):  NodeonRack[] {
            this.warnMessage="";
            let rackLayout:NodeonRack[] = [];
            _.forEach(  devices, d => {
                        let n = new NodeonRack(  {position: d.position, height:d.height, name: d.name, deviceSN: d.serialNumber, type: d.type } );
                        rackLayout.push( n );
                    });
            if( rackLayout.length==0 ){
                this.warnMessage='Newly arrived rack, you can deploy your devices on it.';
            }
            this.fillBlankSlots( devices,rackLayout );
            rackLayout = _.reverse(  _.sortBy( rackLayout, 'position') ); // the HTML will display the rack from bottom to top
            if( devices.length>0 &&  rackLayout[0].type !='network' ){
                this.warnMessage='No Network Switch avaiable to be deployed to this rack, please arrange your device purchange plan.';
            }
            return rackLayout;

    }
    ///////////////////////////////////////////////////
    // the HTML requires the empty slot to filled with a blank <li>
    fillBlankSlots(devices: Device[], rackLayout: NodeonRack[] ){
        let flags= new Array(this.rackHeight);
        flags.fill(false);
        _.forEach(  devices, d => {
            _.range(d.height).forEach( i => flags[d.position-1+i]=true )
        });

        for (let i =0; i< this.rackHeight; i++ ){
            if( ! flags[i] ) { // occupied == false
                rackLayout.push( {position: i+1, height:1, name:"", deviceSN:"" ,type:""}  );
            }
        }
    }

    ///////////////////////////////////////////////////
    ngOnInit(){


        let promiseAllRacks   = this.inventoryService.getAllRacks().toPromise();
        let promiseDeviceType = this.inventoryService.getDeviceTypes().toPromise();
        let mockMaxNodeHeight= 5;

        this.route.params.subscribe( (params: ParamMap) => {
            this.rackID = params['id'];
            this.loading = true;
            this.rackLayout=[];
            this.allRacks=[];

            promiseAllRacks.then( rackList => {
                Object.keys(rackList).forEach(
                         key =>      this.allRacks.push({rackID:key, cnt:rackList[key]})
                );
                promiseDeviceType.then( types => {
                    let promiseDeviceList =
                            this.inventoryService.getDeviceByRackID(String(this.rackID)).toPromise();
                    promiseDeviceList.then( devices => {
                        this.rackLayout = this.buildRackLayout( devices, this.rackID );
                        this.loading = false;
                    });
                });
            });
        });

    }


}
