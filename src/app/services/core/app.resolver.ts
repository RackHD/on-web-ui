import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class DataResolver implements Resolve<any> {
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return Observable.of({ res: 'I am data'});
  }
}

/**
 * App wide providers.
 * An array of services to resolve routes with data.
 * Resolve means do someting before routing. So resolvers can be executed before
 * the component constructor.
 * For example:
 * you route to a page ./item/1, which is provided by ItemComponent and shows item details.
 * then date-get-api-calling can be done by resolver and then it pass data to the component.
 */
export const APP_RESOLVER_PROVIDERS = [
  DataResolver
];
