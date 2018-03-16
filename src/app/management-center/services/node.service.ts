import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/delay';
import { Node, NODE_TYPES, NODE_URL } from '../../models';

import { environment } from 'environments/environment';

@Injectable()
export class NodeService {
  private baseUrl = environment.RACKHD_API;

  constructor(private http: HttpClient) { }

  public getAllNodes(): Observable<Node[]>  {
    let url = this.baseUrl + NODE_URL.nodes;
    return this.http.get<Node[]>(url);
  }

  public getNodeById(id: string): Observable<Node> {
    let url = this.baseUrl + NODE_URL.nodesById + id;
    return this.http.get<Node>(url);
  }

  public getNodeTypes(): Observable<string[]> {
    return Observable.of(NODE_TYPES).delay(500);
  }
}
