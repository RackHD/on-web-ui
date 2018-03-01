/*
 This defines the data model of web user.
*/
import * as _ from 'lodash';

export class RackhdSetting {
    constructor(payload:any){
        _.assign(this,payload);
    }
    northboundApi: string;
    websocketUrl:  string;
    elasticSearchUrl?: string;
    authEnabled: boolean;
    connSecured: boolean;
    authToken?: string;
}

export const RACKHD_CONFIG = new RackhdSetting({
  northboundApi: '127.0.0.1:9090/api/2.0',
  websocketUrl: '127.0.0.1:9100',
  elasticSearchUrl: '127.0.0.1:9200',
  authEnabled: false,
  connSecured: false,
  authToken: ''
});

export const API_PATTERN = '^(\\d{1,3}\\.){3}\\d{1,3}\\:\\d{1,5}\\/api\\/(2\\.0|current)$';
export const ADDR_PATTERN = '^(\\d{1,3}\\.){3}\\d{1,3}\\:\\d{1,5}$';
