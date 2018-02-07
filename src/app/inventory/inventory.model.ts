import * as _ from 'lodash';

export const DeviceTypes = [
  'compute',
  'enclosure',
  'switch',
  'pdu',
  'mgmt'
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
  }
  autoDiscover: boolean;
  id: string;
  identifiers: string;
  name: string;
  type: string;
  obms: string [];
  ibms: string [];
  sku: string;
  discoveredTime: string;
}

let mockNodes = require('./inventory.nodes.json');

let devices: Device[] = [];
_.forEach(mockNodes, (node) => {
  let tmpDevice = new Device({
    autoDiscover: node.autoDiscover,
    id: node.id,
    identifiers: node.identifiers,
    name: node.name || '',
    type: node.type,
    obms: _.isEmpty(node.obms) ? undefined : getObms(node.obms),
    ibms: _.isEmpty(node.ibms) ? undefined : getObms(node.ibms),
    sku: _.isEmpty(node.sku) ? undefined : getSku(node.sku),
    discoveredTime: ''
  });
  devices.push(tmpDevice);
})

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

function relateNodes(relations) {
  let relationship = [];
  _.forEach(relations, function(relation){
    let relationString = relation.relationType + relation.targets.toString();
    relationship.push(relationString);
  });
}

function getObms(obms) {
  let obmList = [];
  _.forEach(obms, function(obm){
    obmList.push(obm.service);
  });
  return obmList;
}

function getSku(sku) {
  return sku.split('/').pop();
}
