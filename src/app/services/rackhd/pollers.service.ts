import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { Poller, POLLER_URL } from 'app/models';

import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
import { RackhdHttpService } from 'app/utils/rackhd-http';

@Injectable()
export class PollersService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, POLLER_URL);
  }

  public createPoller(payload: object): Observable<Poller> {
    return this.post(payload);
  }

  public getLatestData(id: string): Observable<any> {
    return this.getByIdentifier(id, 'json', POLLER_URL.data);
  }
}
