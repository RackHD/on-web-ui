import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import {CONFIG_URL } from '../../models';
import { RackhdHttpService } from '../../utils/rackhd-http';
import { Observable } from 'rxjs/Observable';

import { RackhdLocalStorage as RackHD } from '../../utils/globals-util';

@Injectable()
export class ConfigService extends RackhdHttpService {
  constructor(public http: HttpClient) {
    super(http, CONFIG_URL);
  }
}
