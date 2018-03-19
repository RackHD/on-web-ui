import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import { GRAPH_URL } from '../../models';
import { RackhdHttpService } from './rackhd-http';

@Injectable()
export class GraphService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, GRAPH_URL);
  }
}
