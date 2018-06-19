import { Injectable } from '@angular/core';
import { HISTORY_WORKFLOW_STATUS, WORKFLOW_URL } from 'app/models';
import { RackhdHttpService } from 'app/utils/rackhd-http';
import { NodeService } from 'app/services/rackhd/node.service';
import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
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

  constructor(
    public http: HttpClient,
    private nodeService: NodeService
  ) {
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

  public runWorkflow(nodeId: string, workflowName: string, payload: object): Observable<any>{
    let param = WORKFLOW_URL.getAllUrl + "?name=" + workflowName;
    return this.nodeService.postByIdentifier(nodeId, payload, param);
  }

  public cancelActiveWorkflow(nodeId: string): Observable<any[]> {
    let param = "/workflows/action";
    let payload = { "command": "cancel" };
    return this.nodeService.putByIdentifier(nodeId, payload, param);
  }

}
