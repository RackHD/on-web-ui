import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import { CookieService } from 'ngx-cookie';

import { UserService } from './user.service';
// a const k:v service will be added.
const tokenName = "marsAuthToken";

/**
 * A service provides all authority functions.
 */
@Injectable()
export class AuthService {
  redirectUrl: string;

  constructor(
      private _cookieService:CookieService,
      private _userService: UserService
    // store the URL so we can redirect after logging in
  ){}


  get authToken(): string{
    return this._cookieService.get(tokenName);
  }

  get isLogined(): boolean{
    return this._cookieService.get(tokenName) ? true : false;
  }

  login(user: string, password: string): Observable<any> {
      let usernameInDb = this._userService.getUserByName(user);

      // we don't have backend api so this is just static example
      // this case ignore the front-end code bug error but just throw backend code error
      const mockAuthVerify = Observable.create((observer) => {
        if( usernameInDb !=null && password == usernameInDb .password ){
        this._userService.putLoginedUser(user);
        observer.next({
          token: "12345"
        })
      } else{
        observer.error({
          status: "401",
          error: "Auth failed, wrong username or password."
        });
      }
    });

    return mockAuthVerify.delay(0);
  }


  logout(): void {
    let user = this._userService.getCurrentUser();
    if (user.username === 'admin'){
      user.initialSetupShowed = false;
      this._userService.updateUser(user);
    }
    this.clearLoginData();
  }

  setLoginedStatus(token: string){
    this._cookieService.put(tokenName, token)
  }

  get loginUser(){
    return  this.isLogined ?  this._userService.getLoginedUser(): "";

  }
  clearLoginData(){
    this._cookieService.remove(tokenName)
    localStorage.removeItem(tokenName);
  }

  keepLoginStatus(token: string){
    console.log("remember login!!")
    localStorage.setItem(tokenName, token);
  }

  initLoginStatus(){
    let token = localStorage.getItem(tokenName);
    if (token){
      this._cookieService.put(tokenName, token);
    }
  }

  resetPassword(email: string): Observable<any>{
      const mockPasswordReset = Observable.create((observer) => {
      if ( email === "alan.wei@dell.com"){
        observer.next({
          status: "200"
        })
      } else{
        observer.error({
          status: "404",
          error: "Can't find any account related to this email."
        });
      }
    });
    return mockPasswordReset.delay(0);
  }
}
