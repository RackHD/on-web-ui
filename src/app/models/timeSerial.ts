/*
 This defines the data model of time serial data.
*/
import * as _ from 'lodash';

export class TimeSerialData{
    constructor(d:any){
        _.assign(this,d);
    }
    time: Date ;
    value: number;
}

export class MetricData{
    constructor(d:any){
        _.assign(this,d);
    }
    name: string; // name of the metrics
    dataArray: TimeSerialData[];
}
