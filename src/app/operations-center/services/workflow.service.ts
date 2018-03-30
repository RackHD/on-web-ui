import { Injectable } from '@angular/core';
import { HISTORY_WORKFLOW_STATUS, WORKFLOW_URL } from '../../models';
import { RackhdHttpService } from '../../utils/rackhd-http';
import { RackhdLocalStorage as RackHD } from '../../utils/globals-util';
import { Observable } from 'rxjs/Observable';

import {
  HttpErrorResponse,
  HttpResponse,
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

@Injectable()
export class WorkflowService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, WORKFLOW_URL);
  }

  public getAllActive(): Observable<any[]> {
    return this.getAll({ active: true });
  }

  public getAllHistory(): Observable<any[]> {
    return this.getAll({ active: false });
  }

  public getWorkflowStatusTypes(): Observable<string[]> {
    return Observable.of(HISTORY_WORKFLOW_STATUS).delay(5);
  }

  public cancelWorkflow(identifier: string): Observable<any[]> {
    let url = RackHD.getBaseUrl() + "/nodes/" + identifier + "/workflows/action";
    let body = { "command": "cancel" };
    return this.http.post<any>(url, body);
  }

  public getWorkflow(injectableName?: string): Observable<any[]> {
    let url = RackHD.getBaseUrl() + '/workflows/graphs';
    if (injectableName) {
      url += '/' + injectableName;
    }
    return this.http.get<any>(url);
  }

  public getTask(injectableName?: string): Observable<any[]> {
    let url = RackHD.getBaseUrl() + '/workflows/tasks';
    if (injectableName) {
      url += '/' + injectableName;
    }
    return this.http.get<any>(url);
  }

  public getInitWorkflow(): any {
    return {
      "friendlyName": "name",
      "injectableName": "injectableName",
      "tasks": [
      ]
    }
  }

  public putGraph(jsonData: string): Observable<any[]> {
    let url = RackHD.getBaseUrl() + '/workflows/graphs';
    let options = {headers: { 'Content-Type': 'application/json'} ,
    responseType: 'text' as 'json'};
    return this.http.put<any>(url, jsonData, options);
  }
}
