import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { IBM, IBM_URL } from 'app/models';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
import { RackhdHttpService } from 'app/utils/rackhd-http';

@Injectable()
export class IbmService extends RackhdHttpService {
  constructor(public http: HttpClient) {
    super(http, IBM_URL);
  }
}
