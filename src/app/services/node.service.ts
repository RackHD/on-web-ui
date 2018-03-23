import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/delay';
import { Node, NODE_TYPES, NODE_URL } from '../models';

import { RackhdLocalStorage as RackHD } from '../utils/globals-util';
import { SKU_URL } from 'app/models/sku';

@Injectable()
export class NodeService {

  constructor(private http: HttpClient) { }

  public getAllNodes(): Observable<Node[]> {
    let url = RackHD.getBaseUrl() + NODE_URL.nodes;
    return this.http.get<Node[]>(url);
  }

  public getNodeById(id: string): Observable<Node> {
    let url = RackHD.getBaseUrl() + NODE_URL.nodesById + id;
    return this.http.get<Node>(url);
  }

  public getNodeTypes(): Observable<string[]> {
    return Observable.of(NODE_TYPES).delay(500);
  }

  public creatOneNode(jsonData: string): Observable<Node> {
    let url = RackHD.getBaseUrl() + NODE_URL.nodes;
    return this.http.post<Node>(url, jsonData,
      { headers: { 'Content-Type': 'application/json' } });
  }

  public deleteNodes(nodes: Node[]): Array<Observable<Object>> {
    let obsList: Array<Observable<Object>> = [];
    for (let entry of nodes) {
      let url = RackHD.getBaseUrl() + NODE_URL.nodesById + entry.id;
      let response = this.http.delete<Object>(url,
        { headers: { 'Content-Type': 'application/json' } });
      obsList.push(response);
    }
    return obsList;
  }

  public get(suffix: string): Observable<any> {
    let url = RackHD.getBaseUrl() + suffix;
    return this.http.get<any>(url);
  }

  public postWorkflow(nodeId: string, workflowName: string, payload: string): Observable<any>{
    let url = RackHD.getBaseUrl() + NODE_URL.nodesById + nodeId + '/workflows?name=' + workflowName;
    return this.http.post(url, payload, { headers: { 'Content-Type': 'application/json' } });
  }
}
