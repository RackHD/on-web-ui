import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { IBM, IBM_URL } from '../../models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import { RackhdLocalStorage as RackHD } from '../../utils/globals-util';
import { RackhdHttpService } from '../../utils/rackhd-http';

@Injectable()
export class IbmService extends RackhdHttpService {
  constructor(public http: HttpClient) {
    super(http, IBM_URL);
  }
}
