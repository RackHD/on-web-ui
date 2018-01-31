import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  NavigationExtras,
  CanLoad, Route
}                           from '@angular/router';
import { AuthService }      from './auth.service';

/**
 * This AuthGuard can prevent an logined user to navigate to any page that forbids authority
 * Put this AuthGuard in routes :
 *     { path: 'test', component: TestComponent, can: [UnAuthGuard]}
 * Then this guard will be executed when routers navigate to the related 'test' path.
 * If a logined user want to route to test page then it will be redirected to current page or home page.
 */
@Injectable()
export class UnAuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;

    return this.checkLogin(url);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    let url = `/${route.path}`;

    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    if (!this.authService.isLogined) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Set our navigation extras object
    // that contains our global query params and fragment
    let navigationExtras: NavigationExtras = {
      queryParams: {},
      fragment: ''
    };

    // Navigate to the login page with extras
    this.router.navigate(['/home'], navigationExtras);
    return false;
  }
}
