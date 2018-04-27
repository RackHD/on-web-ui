import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import {GlobalAlertService} from "../services/core/global-alert.service";

@Component({
  selector: 'app-global-alert',
  templateUrl: './global-alert.component.html',
  styleUrls: ['./global-alert.component.css']
})
export class GlobalAlertComponent implements OnInit {
  errorMsges = [];
  msgId = 0;
  showErrors = false;
  constructor(
    public globalAlertService: GlobalAlertService
  ){}

  ngOnInit(){
    this.globalAlertService.getAlertQueue().subscribe(
      msg => {
        if(_.findIndex(this.errorMsges, (cMsg)=> cMsg.text === msg) === -1){
          let errorContent;
          try {
            errorContent = JSON.parse(msg);
          }catch (e){
            errorContent = msg;
          }
          this.errorMsges.push({id: this.msgId, text: errorContent});
          this.errorMsges = [].concat(this.errorMsges);
          this.showErrors = true;
          this.msgId += 1;
        }
      }
    )
  }

  closeAlert(msgId: string){
    _.remove(this.errorMsges, (msg) => msg.id === msgId);
    this.showErrors = false;
  }

}

