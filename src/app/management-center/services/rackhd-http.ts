import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

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
}
