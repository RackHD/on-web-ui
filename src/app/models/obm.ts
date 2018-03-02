/*
 This defines the data model of Node's OBM.
*/
export class OBM {
    id: string;
    node: string;
    service: string;
    config: {};
}

export const OBM_URL = {
    obms: '/obms',
    obmsById: '/obms/',
}