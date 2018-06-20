/*
 This defines the data model of Node's OBM.
*/
export class IBM {
    id: string;
    node: string;
    service: string;
    config: {};
}

export const IBM_URL = {
    ibms: '/ibms',
    ibmsById: '/ibms/',
}
