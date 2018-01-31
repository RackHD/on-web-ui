import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse} from '@angular/common/http';

import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { AuthService } from './auth.service';

/**
 * This interceptor is for popupping the loginExpired page when found token expired
 * It will run in the chain of every api calling and when any api calling
 * returns 401, the loginExpired page will be popupped.
 * This interceptor is injected in core.module.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .do(event => {
        if (event instanceof HttpResponse) {
          // Judge if it's 401 failed auth error
          // this code must be changed when we get MARS auth api
          let returnCode = event.body[0].status
          if (returnCode === "401"){
            this.authService.redirectUrl = this.router.url;
            this.router.navigate([{ outlets: { loginExpired: ['re-login']}}]);
          }
        }
      });
  }
}
