import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { IBM, IBM_URL } from '../../models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import { RackhdLocalStorage as RackHD } from '../../utils/globals-util';

@Injectable()
export class IbmService {
  constructor(private http: HttpClient) { }
  public getAllIbms(): Observable<IBM[]> {
    let url = RackHD.getBaseUrl() + IBM_URL.ibms;
    return this.http.get<IBM[]>(url);
  }

  public getIbmById(id: string): Observable<IBM> {
    let url = RackHD.getBaseUrl() + IBM_URL.ibmsById + id;
    return this.http.get<IBM>(url);
  }

  public creatOneIbm(jsonData: string): Observable<IBM> {
    let url = RackHD.getBaseUrl() + IBM_URL.ibms;
    return this.http.put<IBM>(url, jsonData,
      { headers: { 'Content-Type': 'application/json' } });
  }

  public deleteIbms(ibms: IBM[]): Array<Observable<Object>> {
    let obsList: Array<Observable<Object>> = [];
    for (let entry of ibms) {
      let url = RackHD.getBaseUrl() + IBM_URL.ibmsById + entry.id;
      let response = this.http.delete<Object>(url,
        { headers: { 'Content-Type': 'application/json' } });
      obsList.push(response);
    }
    return obsList;
  }
}
