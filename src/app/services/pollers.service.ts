import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { Poller, POLLER_URL } from '../models';

import { RackhdLocalStorage as RackHD } from '../utils/globals-util';

@Injectable()
export class PollersService {

  constructor(private http: HttpClient) { }

  public getAllPollers(): Observable<Poller[]> {
    let url = RackHD.getBaseUrl() + POLLER_URL.pollers;
    return this.http.get<Poller[]>(url);
  }

  public creatOnePoller(jsonData: object): Observable<Poller> {
    let url = RackHD.getBaseUrl() + POLLER_URL.pollers;
    return this.http.post<Poller>(url, jsonData,
      { headers: { 'Content-Type': 'application/json' } });
  }

  public getLatestData(id: string): Observable<any> {
    let url = RackHD.getBaseUrl() + POLLER_URL.pollersById + id + POLLER_URL.data;
    return this.http.get<any>(url);
  }

  public patchData(id: string, jsonData: string): Observable<any> {
    let url = RackHD.getBaseUrl() + POLLER_URL.pollersById + id;
    return this.http.patch<any>(url, jsonData, { headers: { 'Content-Type': 'application/json' } });
  }

  public deletePollers(pollers: Poller[]): Array<Observable<Object>> {
    let obsList: Array<Observable<Object>> = [];
    for (let entry of pollers) {
      let url = RackHD.getBaseUrl() + POLLER_URL.pollersById + entry.id;
      let response = this.http.delete<Object>(url,
        { headers: { 'Content-Type': 'application/json' } });
      obsList.push(response);
    }
    return obsList;
  }
}
