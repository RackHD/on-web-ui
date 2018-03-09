import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { OBM, OBM_URL } from '../models';

import { environment } from 'environments/environment';

@Injectable()
export class ObmService {
  private baseUrl = environment.RACKHD_API;

  constructor(private http: HttpClient) { }

  public getAllObms(): Observable<OBM[]> {
    let url = this.baseUrl + OBM_URL.obms;
    return this.http.get<OBM[]>(url);
  }

  public getObmById(id: string): Observable<OBM> {
    let url = this.baseUrl + OBM_URL.obmsById + id;
    return this.http.get<OBM>(url);
  }

  public creatOneObm(jsonData: string): Observable<OBM> {
    let url = this.baseUrl + OBM_URL.obms;
    return this.http.put<OBM>(url, jsonData,
      { headers: { 'Content-Type': 'application/json' } });
  }

  public deleteObms(obms: OBM[]): Array<Observable<Object>> {
    let obsList: Array<Observable<Object>> = [];
    for (let entry of obms) {
      let url = this.baseUrl + OBM_URL.obmsById + entry.id;
      let response = this.http.delete<Object>(url,
        { headers: { 'Content-Type': 'application/json' } });
      obsList.push(response);
    }
    return obsList;
  }
}
