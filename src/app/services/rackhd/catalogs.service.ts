import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { Catalog, CATALOG_URL, NODE_URL } from 'app/models';
import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
import { RackhdHttpService } from 'app/utils/rackhd-http';
import { NodeService } from './node.service';

@Injectable()
export class CatalogsService extends RackhdHttpService {

  constructor(
    public http: HttpClient,
    private nodeService: NodeService
  ) {
    super(http, CATALOG_URL);
  }

  public getSource(nodeId: string, source: string): Observable<any> {
    let param = CATALOG_URL.getByIdentifierUrl + source;
    return this.nodeService.getByIdentifier(nodeId, 'json', param);
  }
}
