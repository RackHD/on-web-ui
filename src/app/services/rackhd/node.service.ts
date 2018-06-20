import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

import { Node, NODE_TYPES, NODE_URL } from 'app/models';
import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
import { RackhdHttpService } from 'app/utils/rackhd-http';

import { SKU_URL } from 'app/models/sku';

@Injectable()
export class NodeService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, NODE_URL);
  }

  public getNodeTypes(): Observable<string[]> {
    return Observable.of(NODE_TYPES).delay(5);
  }
}
