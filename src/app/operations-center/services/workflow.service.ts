import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { WORKFLOW_URL, HISTORY_WORKFLOW_STATUS } from '../../models';
import { RackhdHttpService } from '../../utils/rackhd-http';
import { RackhdLocalStorage as RackHD } from '../../utils/globals-util';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WorkflowService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, WORKFLOW_URL);
  }

  public getAllActive(): Observable<any []> {
    return this.getAll({active: true});
  }

  public getAllHistory(): Observable<any []>{
    return this.getAll({active: false});
  }

  public getWorkflowStatusTypes(): Observable<string[]> {
    return Observable.of(HISTORY_WORKFLOW_STATUS).delay(5);
  }

  public cancelWorkflow(identifier: string): Observable<any []>{
    let url = RackHD.getBaseUrl() + "/nodes/" + identifier + "/workflows/action";
    let body = {"command": "cancel"};
    return this.http.post<any>(url, body);
  }
}
