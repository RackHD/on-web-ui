import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { Catalog, CATALOG_URL, NODE_URL } from '../models';

import { RackhdLocalStorage as RackHD } from '../utils/globals-util';

@Injectable()
export class CatalogsService {

  constructor(private http: HttpClient) { }

  public getAllCatalogs(): Observable<Catalog[]>  {
    let url = RackHD.getBaseUrl() + CATALOG_URL.catalogs;
    return this.http.get<Catalog[]>(url);
  }

  public getCatalogById(id: string): Observable<Catalog> {
    let url = RackHD.getBaseUrl() + CATALOG_URL.catalogsById + id;
    return this.http.get<Catalog>(url);
  }

  public getSource(nodeId: string, source: string): Observable<any> {
    let url = RackHD.getBaseUrl() + NODE_URL.nodesById + nodeId + CATALOG_URL.catalogsById + source;
    return this.http.get<any>(url);
  }
}
