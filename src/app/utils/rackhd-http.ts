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

  public getAll(query?: any): Observable<any []>  {
    let url = RackHD.getBaseUrl() + this.urlConfig.getAllUrl;
    let options = _.isEmpty(query) ? {} : {params: query};
    return this.http.get<any []>(url, options);
  }

  public getByIdentifier(identifier: string, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.get<any>(url, options);
  }

  public patch(body: object, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = RackHD.getBaseUrl() + this.urlConfig.patchUrl;
    return this.http.patch<any>(url, body, options);
  }

  public put(body: object, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = RackHD.getBaseUrl() + this.urlConfig.patchUrl;
    return this.http.put<any>(url, body, options);
  }

  public post(body: object, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = RackHD.getBaseUrl() + this.urlConfig.patchUrl;
    return this.http.put<any>(url, body, options);
  }

  public putByIdentifier(identifier:string, body: object): Observable<any> {
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.put<any>(url, body);
  }

  public delete(identifier: string, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.delete<any>(url, options);
  }

  public upload(identifier: string, file: File, responseType='json'): any {
    //Angular doesn't support upload formData with 'application/x-www-form-urlencoded'
    //RackHD files API only supports 'application/x-www-form-urlencoded' till now
    //Thus XMLHttpRequest() is used instead of HttpClient POST/PUT methods.
    let url = RackHD.getBaseUrl() + this.urlConfig.getByIdentifierUrl + identifier;
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(file);
  }

  public getMetaByIdentifier(identifier: string, responseType: string="json"): any {
    let options = {responseType: responseType as 'json'};
    let url = RackHD.getBaseUrl() + this.urlConfig.getMetadataUrl + identifier;
    if (url.search('metadata') === -1) {
      url += "/metadata";
    }
    return this.http.get<any>(url, options);
  }
}
