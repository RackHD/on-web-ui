import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { RACKHD_CONFIG } from 'app/models/index';
import { Observable } from 'rxjs/Observable';
import { timeout } from 'rxjs/operators/timeout';

import * as _ from 'lodash';

@Injectable()
export class SettingService {

  constructor(private http: HttpClient) {}

  get northboundApi():string { return this.getConfigValue('northboundApi'); }
  set northboundApi(value:string) {this.setConfigValue('northboundApi', value); }

  get websocketUrl():string { return this.getConfigValue('websocketUrl'); }
  set websocketUrl(value:string) { this.setConfigValue('websocketUrl', value); }

  get authEnabled():boolean { return this.getConfigValue('authEnabled'); }
  set authEnabled(value:boolean) { this.setConfigValue('authEnabled', !!value);}

  get connSecured():boolean { return this.getConfigValue('connSecured'); }
  set connSecured(value:boolean) { this.setConfigValue('connSecured', !!value); }

  get authToken():string { return this.getConfigValue('authToken'); }
  set authToken(value:string) { this.setConfigValue('authToken', value); }

  getConfigValue(key: string): any {
    let globalKey = 'rackhd.' + key;
    let value = window.localStorage.getItem(globalKey);
    if (!value //window.localStorage only stores string
      || value === "undefined"
      || value === "null") { return RACKHD_CONFIG[key]; }
    if (value === "false") return false;
    return value;
  }

  setConfigValue(key: string, value: any): any {
    let globalKey = 'rackhd.' + key;
    window.localStorage.setItem(globalKey, value);
    return value;
  }

  loadDefaultConfig(){
    return RACKHD_CONFIG;
  }

  loadInitialConfig(){
    _.forEach(_.keys(RACKHD_CONFIG), key => {
      let _key = 'rackhd.' + key;
      if (!window.localStorage.getItem(_key)){
        this[key] = RACKHD_CONFIG[key];
      }
    })
  }

  clearAllConfig(){
    _.forEach(_.keys(RACKHD_CONFIG), function(key){
      key = 'rackhd.' + key;
      if (window.localStorage.getItem(key)){
        window.localStorage.removeItem(key);
      }
    });
  }

  generateToken(user: string, password: string): Observable<any> {
    let url = this.northboundApi.split("/")[0];
    let body = {
      username: user,
      password: password,
      role: "Administrator"
    }
    url = (this.connSecured ? "https" : "http") + "://" + url + "/login";
    return this.http.post(url, JSON.stringify(body),
      {headers: new HttpHeaders({"Content-Type": "application/json"})}
    ).pipe(
      timeout(500)
    );
  }

}
