import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, retry } from 'rxjs/operators';
import { Catalog, CATALOG_URL } from '../models';

import { environment } from 'environments/environment';

@Injectable()
export class CatalogsService {
  private baseUrl = environment.RACKHD_API;

  constructor(private http: HttpClient) { }

  public getAllCatalogs(): Observable<Catalog[]>  {
    let url = this.baseUrl + CATALOG_URL.catalogs;
    return this.http.get<Catalog[]>(url);
  }

  public getCatalogById(id: string): Observable<Catalog> {
    let url = this.baseUrl + CATALOG_URL.catalogsById + id;
    return this.http.get<Catalog>(url);
  }
}
