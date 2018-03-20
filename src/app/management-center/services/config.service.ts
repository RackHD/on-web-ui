import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import {CONFIG_URL } from '../../models';
import { RackhdHttpService } from './rackhd-http';
import { Observable } from 'rxjs/Observable';

import { RackhdLocalStorage as RackHD } from '../../utils/globals-util';

@Injectable()
export class ConfigService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, CONFIG_URL);
  }

  public patch(body: object, responseType='json'): Observable<any> {
    let options = {responseType: responseType as 'json'};
    let url = RackHD.getBaseUrl() + this.urlConfig.patchUrl;
    return this.http.patch<any>(url, body, options);
  }
}
