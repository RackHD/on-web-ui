import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalAlertService {
  alertQueue: Subject<any>;
  constructor(){
    this.alertQueue = new Subject<any>();
  }


  putAlertMsg(msg: string, type: string = 'modal'): void{
    this.alertQueue.next({msg: msg, type: type});
  }

  getAlertQueue(): Subject<any>{
    return this.alertQueue;
  }

}
