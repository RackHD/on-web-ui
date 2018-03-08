import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import 'rxjs/add/operator/delay';
import {CONFIG_URL } from '../../models';

import { environment } from 'environments/environment';
import { RackhdHttpService } from './rackhd-http';

@Injectable()
export class ConfigService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, CONFIG_URL);
  }

  public patch(body: object, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = this.baseUrl + this.urlConfig.patchUrl;
    return this.http.patch<any>(url, body, options);
  }
}
