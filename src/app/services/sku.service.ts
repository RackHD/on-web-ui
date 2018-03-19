import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { SKU, SKU_URL } from 'app/models/sku';

import { RackhdLocalStorage as RackHD } from '../utils/globals-util';

@Injectable()
export class SkusService {

  constructor(private http: HttpClient) { }

  public getAllSkus(): Observable<SKU[]> {
    let url = RackHD.getBaseUrl() + SKU_URL.skus;
    return this.http.get<SKU[]>(url);
  }

  public getSkuById(id: string): Observable<SKU> {
    let url = RackHD.getBaseUrl() + SKU_URL.skusById + id;
    return this.http.get<SKU>(url);
  }

  public creatOneSku(jsonData: string): Observable<SKU> {
    let url = RackHD.getBaseUrl() + SKU_URL.skus;
    return this.http.post<SKU>(url, jsonData,
      { headers: { 'Content-Type': 'application/json' } });
  }

  public deleteSkus(skus: SKU[]): Array<Observable<Object>> {
    let obsList: Array<Observable<Object>> = [];
    for (let entry of skus) {
      let url = RackHD.getBaseUrl() + SKU_URL.skusById + entry.id;
      let response = this.http.delete<Object>(url,
        { headers: { 'Content-Type': 'application/json' } });
      obsList.push(response);
    }
    return obsList;
  }

  public upload(file: File, identifier?: string): any {
    //Angular doesn't support upload formData with 'application/x-www-form-urlencoded'
    //RackHD files API only supports 'application/x-www-form-urlencoded' till now
    //Thus XMLHttpRequest() is used instead of HttpClient POST/PUT methods.
    let url: string;
    let xhr = new XMLHttpRequest();
    if (identifier) {
      url = RackHD.getBaseUrl() + SKU_URL.skusById + identifier + "/pack";
    } else {
      url = RackHD.getBaseUrl() + SKU_URL.skusPack;
    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(file);
  }

}
