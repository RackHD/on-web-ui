import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class GlobalAlertService {
  alertQueue: Subject<string>;
  constructor(){
    this.alertQueue = new Subject<string>();
  }

  putAlertMsg(msg: string): void{
    this.alertQueue.next(msg);
  }

  getAlertQueue(): Subject<string>{
    return this.alertQueue;
  }

}
