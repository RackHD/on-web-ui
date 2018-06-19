import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { SKU, SKU_URL} from 'app/models/sku';

import { RackhdLocalStorage as RackHD } from 'app/utils/globals-util';
import { RackhdHttpService } from 'app/utils/rackhd-http';

@Injectable()
export class SkusService extends RackhdHttpService {

  constructor(public http: HttpClient) {
    super(http, SKU_URL);
  }

  public createSku(jsonData: any): Observable<SKU> {
    return this.post(jsonData);
  }

  public uploadByPost(file, identifier?:string): Observable<any> {
    return this.upload(file, identifier, 'post');
  }

  public updateSku(jsonData: any): Observable<SKU> {
    return this.put(jsonData);
  }
}
