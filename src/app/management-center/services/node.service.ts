import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { Node, NODE_TYPES, NODE_URL } from '../../models';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';

import { RackhdLocalStorage as RackHD } from '../../utils/globals-util';

@Injectable()
export class NodeService {

  constructor(private http: HttpClient) { }

  public getAllNodes(): Observable<Node[]>  {
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
}
