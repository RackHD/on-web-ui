import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { AuthInterceptor } from './app.interceptor';
import { AuthService, MockAuthService } from './testing/index';
import { Router, RouterStub } from 'testing/index';

describe('AuthInterceptor', () => {
    let http: HttpClient;
    let httpTesting: HttpTestingController;
    let router: RouterStub;

    beforeEach(() => TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [
            {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true
            },
            {provide: AuthService, useClass: MockAuthService},
            {provide: Router, useClass: RouterStub}
         ]
    }));

    beforeEach(() => {
       http = TestBed.get(HttpClient);
       httpTesting = TestBed.get(HttpTestingController);
       router = TestBed.get(Router);
    });

    describe('auth intercept HTTP requests', () => {

        it('http flow is working normally with this interceptor', () => {
            /**
             * HttpTestingController will mock all the process of http rep/res
             * So we must control every stage of http req/res flow.
             */
            http.get('/api')
               .subscribe(response => {expect(response).toBeTruthy()});
            const request = httpTesting.expectOne(req => req.url === '/api');
            request.flush({});
        });

        it('should navigate to loginExpired page when found return code 401', ()=>{
            spyOn(router, 'navigate');
            http.get('/api')
               .subscribe(response => {expect(response).toBeTruthy()});
            const request = httpTesting.expectOne(req => req.url === '/api');
            request.flush([{status: '401'}]);
            expect(router.navigate).toHaveBeenCalledWith(
                jasmine.objectContaining(
                    [{ outlets: { loginExpired: ['re-login']}}]
                )
            );
        });
    });

    afterEach(() => {
        // make sure all http flows have finished.
        httpTesting.verify();
    });
});
