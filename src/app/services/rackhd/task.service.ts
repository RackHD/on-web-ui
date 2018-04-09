import { Injectable } from '@angular/core';
import { GRAPHTASK_URL } from 'app/models';
import { RackhdHttpService } from 'app/utils/rackhd-http';
import { Observable } from 'rxjs/Observable';

import {
  HttpErrorResponse,
  HttpResponse,
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';

@Injectable()
export class GraphTaskService extends RackhdHttpService {
  constructor(
    public http: HttpClient
  ){
    super(http, GRAPHTASK_URL);
  }
}
