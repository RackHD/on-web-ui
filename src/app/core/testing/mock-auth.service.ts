import { AuthService } from '../index';
import { Observable } from 'rxjs/Observable';
export { AuthService } from '../index';

const validUser = 'admin';
const validPassword = 'admin';
const internalErrorUser = 'ieuser';
const token = '12345';
const validEmial = 'alan.wei@dell.com';

export class MockAuthService {
    redirectUrl: string;
    login(user:string, pwd:string): any {
        var mockRes: Observable<any>;
        if ( user == validUser && pwd==validPassword){
           mockRes =  Observable.of( {token: token});
        }
        else if (user === internalErrorUser){
            mockRes = Observable.create((observer) =>{
              observer.error({ status: "500", error:"Stub Internal Failure"});
            });
        } else {
            mockRes =  Observable.create((observer) =>{
              observer.error({ status: "401", error:"Stub Auth Failure"});
            });
        }
        return mockRes.delay(0);
    }
    resetPassword(email: string): Observable<any>{
        const mockPasswordReset = Observable.create((observer) => {
        if ( email === validEmial){
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
    logout():void { return ;}
    keepLoginStatus(token:string):void { return ;}
    setLoginedStatus(token:string):void { return ;}
}
