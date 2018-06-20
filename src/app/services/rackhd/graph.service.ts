import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { GRAPH_URL } from 'app/models';
import { RackhdHttpService } from 'app/utils/rackhd-http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class GraphService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, GRAPH_URL);
  }

  public createGraph(payload: any): Observable<any[]> {
    return this.put(payload, 'text');
  }

  public getInitGraph(): any {
    return {
      "friendlyName": "",
      "injectableName": "",
      "tasks": []
    }
  }

}
