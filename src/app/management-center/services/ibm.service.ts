import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { IBM, IBM_URL } from '../../models';

import { environment } from 'environments/environment';

@Injectable()
export class IbmService {
  private baseUrl = environment.RACKHD_API;

  constructor(private http: HttpClient) { }

  public getAllIbms(): Observable<IBM[]> {
    let url = this.baseUrl + IBM_URL.ibms;
    return this.http.get<IBM[]>(url);
  }

  public getIbmById(id: string): Observable<IBM> {
    let url = this.baseUrl + IBM_URL.ibmsById + id;
    return this.http.get<IBM>(url);
  }

  public creatOneIbm(jsonData: string): Observable<IBM> {
    let url = this.baseUrl + IBM_URL.ibms;
    return this.http.put<IBM>(url, jsonData,
      { headers: { 'Content-Type': 'application/json' } });
  }

  public deleteIbms(ibms: IBM[]): Array<Observable<Object>> {
    let obsList: Array<Observable<Object>> = [];
    for (let entry of ibms) {
      let url = this.baseUrl + IBM_URL.ibmsById + entry.id;
      let response = this.http.delete<Object>(url,
        { headers: { 'Content-Type': 'application/json' } });
      obsList.push(response);
    }
    return obsList;
  }
}
