import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import { CookieService } from 'ngx-cookie';
import {
   inject,
   TestBed,
   async,
   fakeAsync,
   tick,
   flushMicrotasks
} from '@angular/core/testing';

import { AuthService } from './auth.service'
import { UserService, MockUserService } from './testing/index';

//============================ Unit Test =======================
describe('AuthService UT', () => {
    // ------------ Variable -------------//
    const _valid_email='alan.wei@dell.com';
    // ------- Stub Service --------------//
    @Injectable()
    class CookieServiceStub{
        get       = (tokenName:string)                => {return "";};
        put       = (tokenName:string,token: string)  => {} ;
        remove    = (tokenName:string)                => {} ;
    }
    // 3rd party stubs
    let _authService, _cookieService, _userService;
    let cookieGetSpy, cookiePutSpy, cookieRemoveSpy;
    let getUserByNameSpy;

    // ---------- beforeEach -------------//
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            providers: [
                AuthService ,
                { provide: UserService, useClass: MockUserService },
                { provide: CookieService , useClass: CookieServiceStub}
            ]
        });

        _authService   = TestBed.get( AuthService );
        _cookieService = TestBed.get( CookieService );
        _userService = TestBed.get(UserService);
        cookieGetSpy = spyOn(_cookieService, 'get');
        cookiePutSpy = spyOn(_cookieService, 'put');
        cookieRemoveSpy = spyOn(_cookieService, 'remove');
        getUserByNameSpy = spyOn(_userService, 'getUserByName');
        //----------------------------------------//
        // Tips:                                  //
        //----------------------------------------//
        // Below two ways make same effect.       //
        // although diff injectable service       //
        // instance.but first one makes code      //
        // shorter                                //
        //                                        //
        // (1)                                    //
        //   //in beforeEach(),                   //
        //   // define provides as above: then    //
        //                                        //
        //   _xx = TestBed.get(ServiceName);      //
        //   // then use var _xx in each it()     //
        //                                        //
        // (2)                                    //
        //  //in each it(), do things below:      //
        //  it('tt',                              //
        //  inject(  [MyService],                 //
        //           (myService: MyService) => {} //
        //  ));                                   //
        //                                        //
        //----------------------------------------//

    }));

    // ------- Test Cases --------------//

    it('should instantiate service when inject service',() => {
         expect(_authService instanceof AuthService).toBe(true);
         expect( _cookieService ).toEqual( _authService._cookieService );
    });

    it('should invoke CookieService.get() when get authToken', () => {
        let ret = _authService.authToken;
        expect( _cookieService.get).toHaveBeenCalled();
    });

    it('should invoke CookieService.get() when get isLogined', () => {
        let ret = _authService.isLogined;
        expect( _cookieService.get).toHaveBeenCalled();
    });

    it('should return true/false when return token/null', () => {
        cookieGetSpy.and.returnValue('some_token');
        let ret = _authService.isLogined;
        expect(ret).toBeTruthy();
        cookieGetSpy.and.returnValue(undefined);
        ret = _authService.isLogined;
        expect(ret).toBeFalsy();
    });

    it('should return a good Observable when user/pass is correct', fakeAsync( () => {
        let ret, err;
        getUserByNameSpy.and.returnValue({password:'pass'});
        _authService.login('user', 'pass').subscribe(
                data   => { ret=data;  },
                error  => { err = error; fail('Should expect no error !') }
            );
        tick();
        flushMicrotasks();
        expect(ret.token).not.toEqual('401');
    }));

    it('should return a bad Observable when user/pass is incorrect', fakeAsync( () => {
        let err;
        getUserByNameSpy.and.returnValue({password:'pass'});
        _authService.login('user','invaild_pass')
            .subscribe(
                data => { fail('expect error, should not go here'); },
                error => { err=error;}  );
        tick();
        expect( err.status).toEqual('401');
    }));

    it('should return a bad Observable when reset password using non-existing email', fakeAsync( () => {
        let err;
        _authService.resetPassword('bad@email.com')
            .subscribe(
                data  =>  { fail('should expect error in this negative case.') },
                error =>  { err=error ; }  );

        tick();
        expect( err.status).toEqual('404');
    }));

    it('should return a good Observable when reset password using good email', fakeAsync( () => {
        let ret;
        _authService.resetPassword(_valid_email)
            .subscribe(
                data => { ret=data },
                err =>  { fail('expect error, should not go here')}  );
        tick();
        expect( ret.status).toEqual('200');
    }));

    it('should call clearLoginData when logout', () => {
        spyOn(_userService, 'getCurrentUser').and.returnValue({username: 'notadmin'});
        let spy = spyOn(_authService,'clearLoginData');
        _authService.logout();
        expect( spy ).toHaveBeenCalled();
    });

    it('should clear cookie and localStorage when called clearLoginData()', () => {
        spyOn(_userService, 'getCurrentUser').and.returnValue({username: 'notadmin'});
        spyOn(localStorage,'removeItem');
        _authService.logout();
        expect(_cookieService.remove).toHaveBeenCalled();
        expect(localStorage.removeItem).toHaveBeenCalled();
    });

    it('should call localStorage when keepLoginStatus ', () => {
        let spy = spyOn(localStorage,'setItem');
        _authService.keepLoginStatus();
        expect( spy ).toHaveBeenCalled();
    });
});
