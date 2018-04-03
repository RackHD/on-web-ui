import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { OBM, OBM_URL } from 'app/models';

import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
import { RackhdHttpService } from 'app/utils/rackhd-http';

@Injectable()
export class ObmService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, OBM_URL);
  }

  public creatObm(jsonData: object): Observable<OBM> {
    return this.put(jsonData);
  }
}
