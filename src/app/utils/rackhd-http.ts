import {ComponentRef, Injectable, Injector} from '@angular/core';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { timeout } from 'rxjs/operators/timeout';
import { RackhdLocalStorage as RackHD } from './globals-util';
import * as _ from 'lodash';
import { ErrorHandlerService, ErrorHanlder } from "../services/core/error-handler.service";

export class RackhdHttpService {

  public errorHandlerService : ErrorHandlerService;
  public injector : Injector;

  constructor(public http: HttpClient, public urlConfig: any) {
    this.injector = window['appInjector'];
    this.errorHandlerService = this.injector.get(ErrorHandlerService);
  }

  static createOptions(responseType?: string, query?: any, header?: any){
    let token: string = RackHD.getToken();
    let options: any = {};
    if(token){
      header = header || {};
      header.authorization = "JWT " + token;
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

  public apiPing(): Observable<any>  {
    let url = RackHD.getBaseUrl() + "/nodes";
    let options = RackhdHttpService.createOptions();
    return this.http.get<any>(url, options)
    .pipe(
      timeout(500)
    );
  }

  @ErrorHanlder()
  public getAll(query?: any, responseType?: string): Observable<any>  {
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    let options = RackhdHttpService.createOptions(responseType, query);
    return this.http.get<any>(url, options);
  }

  @ErrorHanlder()
  public getByIdentifier(identifier: string, responseType?: string, param?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() +
      this.urlConfig.getByIdentifierUrl + identifier +
      (param ? param : '');
    return this.http.get<any>(url, options);
  }

  @ErrorHanlder()
  public patch(body: object, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    return this.http.patch<any>(url, body, options);
  }

  @ErrorHanlder()
  public patchByIdentifier(identifier: string, body: any, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.patch<any>(url, body, options);
  }

  @ErrorHanlder()
  public put(body: any, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    return this.http.put<any>(url, body, options);
  }

  @ErrorHanlder()
  public putByIdentifier(identifier:string, body: object, param?: any, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() +
      this.urlConfig.getByIdentifierUrl + identifier +
      (param ? param : '');
    return this.http.put<any>(url, body, options);
  }

  @ErrorHanlder()
  public post(body: object, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    return this.http.post<any>(url, body, options);
  }

  @ErrorHanlder()
  public postByIdentifier(identifier:string, body: object, param?: any, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() +
      this.urlConfig.getByIdentifierUrl + identifier +
      (param ? param : '');
    return this.http.post<any>(url, body, options);
  }

  @ErrorHanlder()
  public delete(identifier: string, responseType?: string): Observable<any> {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.delete<any>(url, options);
  }

  @ErrorHanlder()
  public deleteByIdentifiers(idList: string [], responseType?: string): Observable<any>{
    let list = [];
    _.forEach(idList, id => {
      list.push(this.delete(id, responseType));
    });
    return forkJoin(list);
  }

  @ErrorHanlder()
  public upload(file: File, identifier?: string, method?: string): any {
    //Angular doesn't support upload formData with 'application/x-www-form-urlencoded'
    //RackHD files API only supports 'application/x-www-form-urlencoded' till now
    //Thus XMLHttpRequest() is used instead of HttpClient POST/PUT methods.
    return Observable.create( observer => {
      try {
        var url = this.urlConfig.uploadSuffix ? this.urlConfig.uploadSuffix : "";
        var xhr = new XMLHttpRequest();
        var token = RackHD.getToken();
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
      } catch(err) {
        observer.error(err);
      }

      xhr.onload = () => {
        if (xhr.status > 199 && xhr.status < 205 ){
          observer.next(xhr.response);
          observer.complete();
        } else {
          observer.error(xhr.response);
        }
      }

      // xhr.onprogress = (event) => {
        // if (event.lengthComputable) {
          // var percentComplete = event.loaded / event.total;
        // }
      // }

      xhr.onerror = () => {
        observer.error(xhr.response || 'Error happend during uploading file');
      }

      xhr.send(file);
    })
  }

  @ErrorHanlder()
  public getMetaByIdentifier(identifier: string, responseType?: string): any  {
    let options = RackhdHttpService.createOptions(responseType);
    let url = RackHD.getBaseUrl() + this.urlConfig.getMetadataUrl + identifier;
    if (url.search('metadata') === -1) {
      url += "/metadata";
    }
    return this.http.get<any>(url, options);
  }
}
