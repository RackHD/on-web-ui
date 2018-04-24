import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { TAG_URL } from 'app/models';

import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
import { RackhdHttpService } from 'app/utils/rackhd-http';
import { NodeService } from './node.service';

@Injectable()
export class TagService extends RackhdHttpService {

  constructor(
    public http: HttpClient,
    public nodeService: NodeService
  ) {
    super(http, TAG_URL);
  }

  public getTagByNodeId(nodeId: string): Observable<any> {
    let param = TAG_URL.getAllUrl;
    return this.nodeService.getByIdentifier(nodeId, 'json', param);
  }

}
