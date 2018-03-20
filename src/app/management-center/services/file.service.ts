import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import {FILE_URL } from '../../models';
import { RackhdHttpService } from './rackhd-http';

@Injectable()
export class FileService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, FILE_URL);
  }
}
