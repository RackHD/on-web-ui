import * as _ from 'lodash';

export const mockDeviceTypes = [
  'compute',
  'storage',
  'network',
  // 'DD',
  // 'HC/HCI'
]

export const mockDeviceStatus= [
  'ok',
  'warning',
  'error'
]

export class DeviceType {
  identifier: string;
  displayName: string;
}

export class DeviceStatus{
  identifier: string;
  displayName: string;
}

export class SystemCapacity {
  cpu?: number;
  networking?: number;
  harddisk?: number;
}




export class Device {
  constructor(data: any){
    _.assign(this, data);
    this.serviceTag = this.serialNumber;
  }
  name: string;
  type: string;
  serialNumber: string;
  // alias
  serviceTag: string;
  systemCapacity: SystemCapacity;
  status: string;
  rack: string;
  site: string;
  telemetryDate: Date;
  ip: string;
  mac: string;
  bmc: string;
  os: string;
  provisioned: boolean;
  height: number;
  position: number;
}

let devices: Device[] = [];
_.forEach(_.range(30), () => {
  let tmpDevice = new Device({
    name: 'compute#' + _.random(1000, 9999),
    type: 'compute',
    serialNumber: Math.random().toString(36).substring(7),
    systemCapacity: {
      cpu: + _.random(1, 100),
      networking: + _.random(1, 100),
      harddisk: + _.random(1, 100)
    },
    status: ['ok', 'warning', 'error'][_.random(0, 2)],
    site: 'SH',
    rack:'',
    position:-1,
    telemetryDate: new Date(),
    ip: genIP(),
    mac: genMAC(),
    bmc: genIP(),
    os: genOS(),
    provisioned: _.random(0, 1) === 1,
    height: _.random(1, 5)
  });
  devices.push(tmpDevice);
})

_.forEach(_.range(9), () => {
  let tmpDevice = new Device({
    name: 'switch#' + _.random(1000, 9999),
    type: 'network',
    serialNumber: Math.random().toString(36).substring(7),
    systemCapacity: {
      networking: + _.random(1, 100)
    },
    status: ['ok', 'warning', 'error'][_.random(0, 2)],
    site: 'SH',
    telemetryDate: new Date(),
    ip: genIP(),
    mac: genMAC(),
    rack:'',
    position:-1,
    provisioned: _.random(0, 1) === 1,
    height: _.random(1, 5)
  });
  devices.push(tmpDevice);
})

_.forEach(_.range(18), () => {
  let tmpDevice = new Device({
    name: 'storage#' + _.random(1000, 9999),
    type: 'storage',
    serialNumber: Math.random().toString(36).substring(7),
    systemCapacity: {
      harddisk: + _.random(1, 100)
    },
    status: ['ok', 'warning', 'error'][_.random(0, 2)],
    site: 'SH',
    telemetryDate: new Date(),
    rack:'',
    position:-1,
    ip: genIP(),
    mac: genMAC(),
    bmc: genIP(),
    provisioned: _.random(0, 1) === 1,
    height: _.random(1, 5)
  });
  devices.push(tmpDevice);
})



////////////////////////////////////////////////
// Demo Purpose Workaround
////////////////////////////////////////////////
export class MockupRack{

    occupiedFlag: boolean[];
    rackHeight :number ;
    maxNodeHeight :number ;
    rackID :number;
    minFreeRatio:number = 0.3; // rack should not filled more than 70%, for pretty view

    ///////////////////////////////////////////////////
    constructor(rackHeight:number,rackID:number, maxNodeHeight:number =5 ){
        this.rackHeight = rackHeight;
        this.maxNodeHeight = maxNodeHeight;
        this.rackID = rackID;
        this.occupiedFlag = new Array(this.rackHeight);
        this.occupiedFlag.fill(false); // create an array , filled with false
    }

    ////////// Put the input devices on to Rack, and for the left nodes, return another array
    ArrangeNodes( devices:Device[] ):Device[]{
        let notArranged:Device[]=[];

        _.forEach( devices, d =>{
            let free= _.countBy(this.occupiedFlag).false;
            if( free <= this.rackHeight* this.minFreeRatio ){
                //skip other node, at least to reserve some free space for fresh air
                notArranged.push( d );
                return;
            }
            let randomPos = MockupRack.findRandomVacancySlot( d.height, this.rackHeight, this.occupiedFlag);
            if( randomPos < 0 ){
                //No Available Room for this new node ${d.name}! whose height =${d.height}, skip it.
                notArranged.push( d );
                return;
            }else{
                d.position = randomPos;
                d.rack = String(this.rackID);
                _.range( d.height).forEach( s => this.occupiedFlag[d.position+s-1] = true ); // update occupied flag

            }
        });
        return  notArranged;
    }

    ///////////////////////////////////////////////////
    static isPositionFit( p:number,
        height:number,
        rackHeight:number,
        occupiedFlag:boolean[] ):boolean{
            if( p-1+height > rackHeight ) {
                return false;
            }
            for( let i=0;i<height;i++){
                if( occupiedFlag[p-1+i] == true) {
                    return false;
                }
            }
            return true;
        }
    ///////////////////////////////////////////////////
    //  return Slot range : 1 to 42
    ///////////////////////////////////////////////////
    static findRandomVacancySlot( height:number,
        rackHeight:number,
        occupiedFlag:boolean[]   ): number {
            let fitPosCandidates:number[]=[];
            for(let p=1;p<=rackHeight;p++){
                if( MockupRack.isPositionFit(p, height, rackHeight, occupiedFlag) ) {
                    fitPosCandidates.push(p);
                }
            };
            if( fitPosCandidates.length > 0 ){
                return fitPosCandidates[ _.random(0,  fitPosCandidates.length-1 )  ];
            }else{
                return -1;
            }
        }
}
///////////////////////////////////////////////////////////////////////
// arrange the nodes into the Racks
//////////////////////////////////////////////////////////////////////
let rackID=1;
let tempDevices = _.shuffle(devices); // shuffle first
while(true){
    let rack = new MockupRack( 42, rackID ); // 42U by default
    tempDevices = rack.ArrangeNodes(tempDevices); // ret value is the nodes list which still not arranged
    if( tempDevices.length == 0 ) {
        break;
    }
    rackID++;
}
////////////////////////////////////////////////////////////////////

export const mockDevices = devices;

// helpers
function genMAC(){
    var hexDigits = "0123456789ABCDEF";
    var macAddress = "";
    for (var i = 0; i < 6; i++) {
        macAddress+=hexDigits.charAt(Math.round(Math.random() * 15));
        macAddress+=hexDigits.charAt(Math.round(Math.random() * 15));
        if (i != 5) macAddress += ":";
    }

    return macAddress;
}

function genIP(){
  return '' + _.random(1,255) + '.' + _.random(1,255) + '.' + _.random(1,255) + '.' + _.random(1,255)
}

function genOS() {
  const OSList = [
    'Ubuntu14.04',
    'Ubuntu16.04',
    'CentOS6',
    'CentOS7',
    'RedHat'
  ]
  return OSList[_.random(0, OSList.length - 1)]
}
