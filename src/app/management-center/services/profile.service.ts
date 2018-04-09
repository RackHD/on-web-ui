import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';
import {PROFILE_URL } from 'app/models';
import { RackhdHttpService } from 'app/utils/rackhd-http';

@Injectable()
export class ProfileService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, PROFILE_URL);
  }
}
