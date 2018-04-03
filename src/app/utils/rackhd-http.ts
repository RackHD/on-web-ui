import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/delay';
import { RackhdLocalStorage as RackHD } from './globals-util';
import * as _ from 'lodash';

export class RackhdHttpService {

  constructor(public http: HttpClient, public urlConfig: any) {
  }

  static createOptions(responseType?: string, query?: any, header?: any){
    let token: string = RackHD.getToken();
    let options: any = {};
    if(token){
      query = query || {};
      query.auth_token = token;
    }
    if(!_.isEmpty(query)){
      options.params = query;
    }
    if(responseType){
      options.responseType = responseType as 'json';
    }
    if(header){
      options.headers = header;
    }
    return options;
  }

  public getAll(query?: any, responseType?: string): Observable<any>  {
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    let options = RackhdHttpService.createOptions(responseType);
    return this.http.get<any>(url, options);
  }

  public getByIdentifier(identifier: string, responseType?: string, param?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() +
      this.urlConfig.getByIdentifierUrl + identifier +
      (param ? param : '');
    return this.http.get<any>(url, options);
  }

  public patch(body: object, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    return this.http.patch<any>(url, body, options);
  }

  public patchByIdentifier(identifier: string, body: any, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.patch<any>(url, body, options);
  }

  public put(body: any, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    return this.http.put<any>(url, body, options);
  }

  public putByIdentifier(identifier:string, body: object, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.put<any>(url, body, options);
  }

  public post(body: object, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    return this.http.post<any>(url, body, options);
  }

  public postByIdentifier(identifier:string, body: object, param?: any, responseType?: string, ): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() +
      this.urlConfig.getByIdentifierUrl + identifier +
      (param ? param : '');
    return this.http.post<any>(url, body, options);
  }

  public delete(identifier: string, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.delete<any>(url, options);
  }

  public upload(file: File, identifier?: string, method?: string): any {
    //Angular doesn't support upload formData with 'application/x-www-form-urlencoded'
    //RackHD files API only supports 'application/x-www-form-urlencoded' till now
    //Thus XMLHttpRequest() is used instead of HttpClient POST/PUT methods.
    let url = this.urlConfig.uploadSuffix ? this.urlConfig.uploadSuffix : "";
    let xhr = new XMLHttpRequest();
    let token = RackHD.getToken();
    if (identifier) {
      url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier + url;
    } else {
      url = RackHD.getBaseUrl() + this.urlConfig.uploadUrl;
    }
    xhr.open(method ? method: 'PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    if(token){
      xhr.setRequestHeader("authorization", "JWT " + token)
    }
    xhr.send(file);
  }

  public getMetaByIdentifier(identifier: string, responseType?: string): any {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getMetadataUrl + identifier;
    if (url.search('metadata') === -1) {
      url += "/metadata";
    }
    return this.http.get<any>(url, options);
  }
}
