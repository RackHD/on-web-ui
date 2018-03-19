import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import {PROFILE_URL } from '../../models';
import { RackhdHttpService } from './rackhd-http';

@Injectable()
export class ProfileService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, PROFILE_URL);
  }
}
