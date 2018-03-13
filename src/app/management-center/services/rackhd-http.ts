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

import { environment } from 'environments/environment';

export class RackhdHttpService {
  public baseUrl = environment.RACKHD_API;

  constructor(public http: HttpClient, public urlConfig: any) {
  }

  public getAll(): Observable<any []>  {
    let url = this.baseUrl + this.urlConfig.getAllUrl;
    return this.http.get<any []>(url);
  }

  public getByIdentifier(identifier: string, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = this.baseUrl + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.get<any>(url, options);
  }

  public patch(body: object, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = this.baseUrl + this.urlConfig.patchUrl;
    return this.http.patch<any>(url, body, options);
  }

  public put(body: object, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = this.baseUrl + this.urlConfig.patchUrl;
    return this.http.put<any>(url, body, options);
  }

  public remove(identifier: string, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = this.baseUrl + this.urlConfig.getByIdentifierUrl + identifier;
    return this.http.delete<any>(url, options);
  }

  public upload(identifier: string, file: File, responseType='json'): any {
    //Angular doesn't support upload formData with 'application/x-www-form-urlencoded'
    //RackHD files API only supports 'application/x-www-form-urlencoded' till now
    //Thus XMLHttpRequest() is used instead of HttpClient POST/PUT methods.
    let url = this.baseUrl + this.urlConfig.getByIdentifierUrl + identifier;
    let xhr = new XMLHttpRequest();
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(file);
  }

  public getMetaByIdentifier(identifier: string, responseType: string="json"): any {
    let options = {responseType: responseType as 'json'};
    let url = this.baseUrl + this.urlConfig.getMetadataUrl + identifier;
    if (url.search('metadata') === -1) {
      url += "/metadata";
    }
    return this.http.get<any>(url, options);
  }
}
