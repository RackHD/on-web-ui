import {TestBed, async} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { AuthGuard } from './auth-guard.service';
import { AuthService, MockAuthService } from './testing/index';
import { Router, RouterStub, NavigationExtras } from  'testing/index';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';

describe('AuthGuard', () => {
    let authGuard: AuthGuard;
    let authService: MockAuthService;
    let router: RouterStub;
    let mockSnapshot:any = jasmine.createSpyObj<RouterStateSnapshot>(
                               "RouterStateSnapshot",
                               ['toString']
                           );

    let mockRoute: any = jasmine.createSpyObj<Route>(
                               "Route",
                               ['path']
                           );

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [
                AuthGuard,
                {provide: AuthService, useClass: MockAuthService },
                {provide: Router, useClass: RouterStub }
            ]
        })
    }));

    beforeEach(() => {
        authGuard = TestBed.get(AuthGuard);
        authService = TestBed.get(AuthService);
        router = TestBed.get(Router);
    });

    it('canActivate is able to hit route when user is logged in', () => {
        authService.isLogined = true;
        expect(authGuard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot)).toBe(true);
    });

    it('canActivate is not able to hit route when user is not logged in', () => {
        authService.isLogined = false;
        expect(authGuard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot)).toBe(false);
    });

    it('canActivateChild can invode canActivate', () => {
        spyOn(authGuard, 'canActivate');
        authGuard.canActivateChild(new ActivatedRouteSnapshot(), mockSnapshot)
        expect(authGuard.canActivate).toHaveBeenCalledWith(new ActivatedRouteSnapshot(), mockSnapshot);
    });

    it('canLoad is able to hit route when user is logged in', () => {
        authService.isLogined = true;
        expect(authGuard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot)).toBe(true);
    });

    it('canLoad is not able to hit route when user is not logged in', () => {
        authService.isLogined = false;
        expect(authGuard.canActivate(new ActivatedRouteSnapshot(), mockSnapshot)).toBe(false);
    });

    it('checkLogin return true when user is logged in', () => {
        let mockUrl = ''
        authService.isLogined = true;
        expect(authGuard.checkLogin(mockUrl)).toBeTruthy();
    });

    it('checkLogin return false and redirectTo login page when user is not logged in', () => {
        spyOn(router, 'navigate');
        let mockUrl = ''
        let mockNavigationExtras: NavigationExtras = {
          queryParams: {},
          fragment: ''
        };
        authService.isLogined = false;
        expect(authGuard.checkLogin(mockUrl)).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['/login'], mockNavigationExtras);
    });
});
