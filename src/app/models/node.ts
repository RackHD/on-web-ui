import * as _ from 'lodash';
/*
 This defines the data model of Node.
*/
export class Node {
    constructor(data: any) {
        _.assign(this, data);
    }
    autoDiscover: boolean;
    catalogs: string;
    id: string;
    identifiers: Array<string>;
    name: string;
    obms: string[];
    tags: string;
    pollers: string;
    relations: string[];
    sku?: string;
    type: string;
    workflows: string;
    ibms: string[];

    discoveredTime: string;
    manufacturer?: string;
    model: string;
}

export class NodeType {
    identifier: string;
    displayName: string;
}

export class NodeStatus {
    identifier: string;
    displayName: string;
}

export const NODE_TYPES = [
    'compute',
    'enclosure',
    'switch',
    'pdu',
    'mgmt',
    'others',
];

export const NODE_URL = {
    getAllUrl: '/nodes',
    getByIdentifierUrl: '/nodes/',
}

export const NODE_TYPE_MAP = {
  compute: 'Compute',
  enclosure: 'Enclosure',
  switch: 'Switch',
  pdu: 'PDU',
  mgmt: 'MGMT',
  others: 'Others',
}
