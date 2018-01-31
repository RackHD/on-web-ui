/**
 * For initialize component
 */
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ClarityModule } from "@clr/angular";
import { IconService } from '../services/core/index';
import { LoginComponent }  from './login.component';
import { Observable } from 'rxjs/Observable';
/**
 * Load mocks
 */
import { HttpClientModule } from '@angular/common/http';
import { AuthService, MockAuthService }      from '../services/core/testing/index';
import { Router, RouterStub, ActivatedRoute, ActivatedRouteStub, NavigationExtras } from '../../testing/index';

/**
 * Load the testing libs
 */
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  inject,
  async,
  fakeAsync,
  tick,
  TestBed,
  ComponentFixture
} from '@angular/core/testing';


//********************************************************************************//
let comp:    LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let de: DebugElement;
let page: Page;
let activatedRoute: ActivatedRouteStub;

// fake data
const validUser = 'admin';
const validPass = 'admin';
const validEmail = 'alan.wei@dell.com';
const internalErrorUser = 'ieuser';


 // Helpers
function createComponent(){
    fixture = TestBed.createComponent(LoginComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    page = new Page();
    fixture.detectChanges();
    page.addPageElements();
}


class Page {
    // only external function should be spy here
    setLoginedStatusSpy: jasmine.Spy;
    keepLoginStatusSpy: jasmine.Spy;
    navgateSpy: jasmine.Spy
    constructor (){
      const router = TestBed.get(Router);
      const authService = TestBed.get(AuthService);
      this.setLoginedStatusSpy = spyOn( authService, 'setLoginedStatus');
      this.keepLoginStatusSpy = spyOn( authService, 'keepLoginStatus');
      this.navgateSpy = spyOn( router, 'navigate');
    }

    //init solid elements
    userInput: any;
    passwordInput: any;
    rememberMeSelectbox: any;
    loginSubmitBtn: any;
    forgetPasswordLink: any;
    forgetPasswordModal: any;
    signupButton: any;
    addPageElements(){
      this.userInput = this.queryNativeEl('#login_username');
      this.passwordInput = this.queryNativeEl('#login_password');
      this.rememberMeSelectbox = this.queryNativeEl('#rememberme');
      this.forgetPasswordLink = this.queryNativeEl('#forgetpass');
      this.loginSubmitBtn = this.queryNativeEl('button[type=submit]');
      this.forgetPasswordModal = this.queryNativeEl('clr-modal');
      this.signupButton  = this.queryNativeEl('#signup');
    }

    // get elements with ngIf, if it exists, get nativeElement else get debugElement
    get msgBarInfo() { return this.queryIfEl('[ng-reflect-alert-type=alert-info]') };
    get msgBarDanger() { return this.queryIfEl('[ng-reflect-alert-type=alert-danger]') };
    get msgDisplay() { return this.queryIfEl('.alert-text') };
    get modalContent() { return this.queryIfEl('.modal-content') };

    // elements be contained in if block, add them when related condition is true.
    emailInput: any;
    cancelBtn: any;
    okBtn: any;
    addFpModalElements(){
      this.emailInput = this.queryNativeEl('clr-modal input');
      this.cancelBtn = this.queryNativeEl('clr-modal .btn-outline');
      this.okBtn = this.queryNativeEl('clr-modal .btn-primary');
    }

    // helpers
    queryNativeEl(css: string){
      return de.query(By.css(css)).nativeElement;
    }
    queryIfEl(css: string){
      var _de = de.query(By.css(css));
      return _de ? _de.nativeElement : _de;
    }
}

describe('LoginComponent', () => {
    //=============== BeforeEach ====================
    beforeAll(()=>{
      var iconService = new IconService();
      iconService.load();
      activatedRoute = new ActivatedRouteStub();
      activatedRoute.testParams= { user: 'admin' };

    })
    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
              HttpClientModule,
              ReactiveFormsModule,
              ClarityModule.forRoot(),
            	BrowserAnimationsModule
              ], // <-- for Form, Clarity
            declarations: [ LoginComponent ],
            providers: [
                { provide: AuthService,    useClass: MockAuthService },
                { provide: Router,         useClass: RouterStub },
                { provide: ActivatedRoute, useValue: activatedRoute }
            ],
        });
    }));
    // synchronous beforeEach
    beforeEach(() => {
        createComponent();
        fixture.detectChanges(); // trigger initial data binding
    });

    //============= Test Cases ==========================
    it(`should LoginComponent has been successfully initialized`,async(() => {
        expect(fixture).toBeDefined();
        expect(comp).toBeDefined();
    }));

    it(`should Login From created`,async(() => {
        // search ng-reflect-name to see if ReactiveForms works normally
        expect(page.userInput).not.toBeNull();
        expect(page.passwordInput).not.toBeNull();
        expect(page.rememberMeSelectbox).not.toBeNull();
        expect(page.forgetPasswordLink).not.toBeNull();
        expect(page.loginSubmitBtn.textContent.toLowerCase()).toEqual(`log in`);
        expect(page.signupButton).not.toBeNull();
    }));

    it(`should remember me checkbox works when click `,fakeAsync(() => {
        expect(page.rememberMeSelectbox.checked).toBeFalsy(); // default state
        expect(comp.loginForm.value.rememberMe).toBeFalsy();
        page.rememberMeSelectbox.click();
        expect(page.rememberMeSelectbox.checked).toBeTruthy(); // state after click
        expect(comp.loginForm.value.rememberMe).toBeTruthy();
    }));

   it('should call login() when login button clicked ', async(() => {
         spyOn(comp, 'login');
         comp.loginForm.controls['user'].setValue(`any`);
         comp.loginForm.controls['password'].setValue(`any`);
         fixture.detectChanges(); //renew to ensure loginForm.status == VALID
         expect( comp.loginForm.status ).toEqual('VALID');
         page.loginSubmitBtn.click();
         expect(comp.login).toHaveBeenCalled();
    }));
   it('should not call login() when login button clicked but form invalid ', async(() => {
         spyOn(comp, 'login');
         comp.loginForm.controls['user'].setValue(`any`);
         comp.loginForm.controls['password'].setValue(``);
         fixture.detectChanges(); //renew to ensure loginForm.status == VALID
         expect( comp.loginForm.status ).toEqual('INVALID');
         page.loginSubmitBtn.click();
         expect(comp.login).not.toHaveBeenCalled();
    }));


    it('should show info message when triggers login', fakeAsync(()=>{
        comp.loginForm.controls['user'].setValue(validUser);
        comp.loginForm.controls['password'].setValue(validPass);
        comp.login();
        fixture.detectChanges();
        expect(page.msgDisplay.textContent).toContain('Trying to log in ...');
        tick();
    }));

    it( 'should hide message bar when input field changes', fakeAsync(() => {
        comp.loginForm.controls['user'].setValue(`bad_user`);
        comp.loginForm.controls['password'].setValue(`invalid_one`);
        comp.login();
        tick();
        fixture.detectChanges();// renew the page to show alert mssage
        //========= then, trigger input form change, to check if the warning message discompears
        comp.loginForm.controls['user'].setValue(`another_user`);
        page.userInput.dispatchEvent(new Event('keyup'));
        fixture.detectChanges();
        expect(page.msgDisplay).toBeNull(); // expect there's no alert text span in DOM
    }));

    describe('When logged successfully', () => {
        beforeEach(() => {
          comp.loginForm.controls['user'].setValue(validUser);
          comp.loginForm.controls['password'].setValue(validPass);
        });

        it('should show success message before navigate', fakeAsync(()=>{
            comp.login();
            tick();
            fixture.detectChanges();
            expect(page.msgDisplay.textContent).toContain('Logged successfully, redirecting ...');
        }));

        it('should save password if rememberMe selected', fakeAsync(() => {
          comp.loginForm.controls['rememberMe'].setValue( true );
          comp.login();
          tick();
          expect(comp.authService.keepLoginStatus).toHaveBeenCalled();
        }));

        it('should not save password if rememberMe not selected', fakeAsync(() => {
          comp.loginForm.controls['rememberMe'].setValue( false );
          comp.login();
          tick();
          expect(comp.authService.keepLoginStatus).not.toHaveBeenCalled();
        }));

        it('should navigate to redirectUrl if redirectUrl exists', fakeAsync(() => {
          const testRoutePath = 'test/path';
          const navigationExtras: NavigationExtras = {
            queryParamsHandling: 'preserve',
            preserveFragment: true
          };
          comp.authService.redirectUrl = testRoutePath;
          comp.login();
          tick();
          expect(comp.router.navigate).toHaveBeenCalledWith([testRoutePath], navigationExtras);
        }));

        it('should navigate to home if redirectUrl not exists', fakeAsync(() => {
          const navigationExtras: NavigationExtras = {
            queryParamsHandling: 'preserve',
            preserveFragment: true
          };
          comp.authService.redirectUrl = undefined;
          comp.login();
          tick();
          expect(comp.router.navigate).toHaveBeenCalledWith(['/home'], navigationExtras);
        }));
    });

    describe('when login failed', () => {
        beforeEach(() => {
          comp.loginForm.controls['user'].setValue('bad_user');
          comp.loginForm.controls['password'].setValue('invalid_one');
        });

        it('should show error massage when login failed', fakeAsync(() => {
          comp.login();
          tick();
          fixture.detectChanges();
          expect(page.msgBarDanger).not.toBeNull();
          expect(page.msgDisplay.textContent).toContain('Auth failed, wrong username or password.');
          comp.loginForm.controls['user'].setValue(internalErrorUser);
          comp.login();
          tick();
          fixture.detectChanges();
          expect(page.msgBarDanger).not.toBeNull();
          expect(page.msgDisplay.textContent).toContain('Server is in maintainace, please try again later.');
        }));
    });




    describe('Forget password modal', () => {
      it('should be not shown when component initialized', () => {
        expect(page.forgetPasswordModal.attributes['ng-reflect-_open'].value).toEqual('false');
      });

      it('should be shown when click forget password button', () => {
        page.forgetPasswordLink.click();
        fixture.detectChanges();
        expect(page.forgetPasswordModal.attributes['ng-reflect-_open'].value).toEqual('true');
        expect(page.modalContent).not.toBeNull();
      });

      describe('after forget password modal shown', () => {
        beforeEach(() => {
          comp.fpOpen = true;
          fixture.detectChanges();
          expect(page.forgetPasswordModal.attributes['ng-reflect-_open'].value).toEqual('true');
          expect(page.modalContent).not.toBeNull();
          page.addFpModalElements();
        });

        it('modal should be closed when click CANCEL btn', () => {
          page.cancelBtn.click();
          fixture.detectChanges();
          expect(page.forgetPasswordModal.attributes['ng-reflect-_open'].value).toEqual('false');
        });

        it('the OK btn should be disabled when modal opened', () => {
          expect(page.okBtn.disabled).toBeTruthy();
        });

        describe('when input values', () => {
          beforeEach(() => {
            page.emailInput.value = 'whatever';
            page.emailInput.dispatchEvent(new Event('keyup'));
            fixture.detectChanges();
          });

          it('the OK btn should be active when input not null', () => {
            expect(page.okBtn.disabled).toBeFalsy();
          });

          it('click the OK button should trigger resetPassword', () => {
            spyOn(comp, 'resetPassword');
            page.okBtn.click();
            expect(comp.resetPassword).toHaveBeenCalled();
          });

          it('show error message when input un-email address', () => {
            page.emailInput.value = 'whatever';
            page.okBtn.click();
            fixture.detectChanges();
            expect(page.msgBarDanger).not.toBeNull();
            expect(page.msgDisplay.textContent).toContain('Please input valid email address!');
          });

          it('show error message when input invaid email address', fakeAsync(() => {
            page.emailInput.value = "asd@emc.com";
            fixture.detectChanges();
            page.okBtn.click();
            fixture.detectChanges();
            expect(page.msgBarDanger).not.toBeNull();
            expect(page.msgDisplay.textContent).toContain('Can\'t find any account related to this email.');
          }));

          it('show success message when input valid email', fakeAsync(() => {
            page.emailInput.value = validEmail;
            page.okBtn.click();
            tick();
            fixture.detectChanges();
            expect(page.msgBarInfo).not.toBeNull();
            expect(page.msgDisplay.textContent).toContain('An email has been sent, please fllow the link in email to reset your password.');
          }));

          it('hide the msg bar when email inputing changes', () => {
            page.emailInput.value = 'whatever';
            page.okBtn.click();
            fixture.detectChanges();
            page.emailInput.value = "another value"
            page.emailInput.dispatchEvent(new Event('keyup'));
            fixture.detectChanges();
            expect(page.msgDisplay).toBeNull();
          });
        });
      })
    });
});
