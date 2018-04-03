import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import {TEMPLATE_URL } from '../../models';
import { RackhdHttpService } from '../../utils/rackhd-http';

@Injectable()
export class TemplateService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, TEMPLATE_URL);
  }
}
