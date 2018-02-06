/**
 * For initialize component
 */
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ClarityModule } from "@clr/angular";
import { IconService } from '../services/core/index';
import { EmailValidator } from '@angular/forms';
import { User, UserService, MockUserService } from '../services/core/testing/index';
/**
 * Load mocks
 */
import { Router,  RouterStub,
    ActivatedRoute, ActivatedRouteStub,
    NavigationExtras } from '../../testing/index';

/**
 * Load the testing libs
 */
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
    inject,
    async, fakeAsync,  tick,
    TestBed, ComponentFixture
} from '@angular/core/testing';
/**
 * Load test target
 */
import { SignupFormComponent } from './signup-form.component';
//********************************************************************************//
let comp: SignupFormComponent;
let fixture: ComponentFixture<SignupFormComponent>;
let de: DebugElement;
let page: Page;

// Helpers
function createComponent(){
    fixture = TestBed.createComponent(SignupFormComponent);
    comp = fixture.componentInstance;
    de = fixture.debugElement;
    page = new Page();
    fixture.detectChanges();
}

class Page {
    // only external function should be spy here
    navgateSpy: jasmine.Spy
    constructor (){
        const router = TestBed.get(Router);
        const userService = TestBed.get(UserService);
        this.navgateSpy = spyOn( router, 'navigate');
    }


    get usernameInput()  { return this.queryIfEl('#gForm_user');}
    get passwordInput()  { return this.queryIfEl('#gForm_password');}
    get emailInput()     { return this.queryIfEl('#gForm_email');}
    get submitBtn()      { return this.queryIfEl('button[type=submit]');}
    get signupForm()     { return this.queryIfEl('#signupForm');}

    queryIfEl(css: string){
        var _de = de.query(By.css(css));
        return _de ? _de.nativeElement : _de;
    }
}

/*Helpful Function*/
function _fillForm( data: User ){
    if ( data.username ) {
        comp.signupForm.controls['username'].setValue( data.username);
        page.usernameInput.dispatchEvent(new Event('input'));
    }
    if ( data.password ) {
        comp.signupForm.controls['password'].setValue( data.password);
        page.passwordInput.dispatchEvent(new Event('input'));
    }
    if ( data.email ) {
        comp.signupForm.controls['email'].setValue( data.email);
        page.emailInput.dispatchEvent(new Event('input'));
    }
};


describe('SignupFormComponent Unit Test', () => {

    const   existingDefaultUser:string = "default";


    //=============== BeforeEach ====================
    beforeAll(()=>{
        var iconService = new IconService();
        iconService.load();

    })
    // async beforeEach
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                ReactiveFormsModule,
                ClarityModule.forRoot(),
            ], // <-- for Form, Clarity
            declarations: [ SignupFormComponent ],
            providers: [
                { provide: Router,         useClass: RouterStub },
                { provide: UserService,    useClass: MockUserService },
            ],
        }).compileComponents();
    }));
    // synchronous beforeEach
    beforeEach(() => {
        createComponent();
        fixture.detectChanges(); // trigger initial data binding
    });

    it('should create Page instance', () => {
        expect(comp).toBeTruthy();
        expect(page.usernameInput).not.toBeNull();
        expect(page.passwordInput).not.toBeNull();
        expect(page.emailInput).not.toBeNull();
        expect(page.submitBtn).not.toBeNull();
    });


    it('should show warning if input user name occupied', async(() => {
        fixture.whenStable().then(() => {
            comp.signupForm.controls['username'].setValue(existingDefaultUser);
            //page.usernameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect( page.queryIfEl("#warn_no") ).not.toBeNull();

            comp.signupForm.controls['username'].setValue("other_user");
            //page.usernameInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect( page.queryIfEl("#warn_no") ).toBeNull();


        });
    }));

    //
    // mixing up fakeAsync with async+whenStable is not good ,but just to show the sample usage for both of them
    //
    it( 'show up the warning when username is too short', fakeAsync(() => {
        comp.signupForm.controls['username'].setValue("12"); // too short
        page.usernameInput.dispatchEvent(new Event('input'));
        tick();
        fixture.detectChanges();// renew the page to show alert mssage
        expect( page.queryIfEl("#warn_ns") ).not.toBeNull();
        comp.signupForm.controls['username'].setValue("valid_name");
        //page.usernameInput.dispatchEvent(new Event('input'));
        // FIXME:  I don't know why without this line ,result is still good...
        tick();
        fixture.detectChanges();// renew the page to show alert mssage
        expect( page.queryIfEl("#warn_ns") ).toBeNull();
    }));

    it('should show warning if input password too short', async(() => {
        fixture.whenStable().then(() => {
            comp.signupForm.controls['password'].setValue("**");
            page.passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect( page.queryIfEl("#warn_ps") ).not.toBeNull();

            page.passwordInput.value="valid_pwd";
            page.passwordInput.dispatchEvent(new Event('input'));
            fixture.detectChanges();
            expect( page.queryIfEl("#warn_ps") ).toBeNull();

        });
    }));

    describe('should disable submit button until all required field filled ', () => {

        it('should invaid form if any required field missing', async(() => {
            fixture.whenStable().then(() => {
                var aUser = new User();

                aUser.username="abc";
                _fillForm(aUser);
                fixture.detectChanges();
                expect( page.submitBtn.disabled ).toBeTruthy();

                aUser.password="abcde";
                _fillForm(aUser);
                fixture.detectChanges();
                expect( page.submitBtn.disabled ).toBeTruthy();

                aUser.email="1@2.3";
                _fillForm(aUser);
                fixture.detectChanges();
                expect( page.submitBtn.disabled ).toBeFalsy();

                spyOn(comp, 'submitForm');
                page.submitBtn.click();
                expect( comp.submitForm).toHaveBeenCalled();

            });
        }));

    });

    // ======= TIPS ===========
    // it was failing :
    //              =>   Error :  Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.
    // because after button clicked, there will be "sleep" before ends.
    // using done() is the only way out.( changing asmine.DEFAULT_TIMEOUT_INTERVAL is useless for this case).
    // NOTE: done() can not be used in async()  or fakeAsync()
    describe('test after submit', () => {

        beforeEach(() => {
            var aUser = new User();
            aUser.username="abc";
            aUser.password="abcde";
            aUser.email="1@2.3";
            _fillForm(aUser);
            fixture.detectChanges();
        });
        it('should show success message after submit clicked  ', done => {
                 expect( page.queryIfEl("#success_info").hidden ).toBeTruthy();

                page.submitBtn.click();
                fixture.detectChanges();
                expect( page.queryIfEl("#success_info").hidden ).toBeFalsy();
                done();
        });
        it('should redirect after submit  ', done => {
            comp.redirectTotalTime = 1; // 5 is too long, change to 1

            let jumpBtn= page.queryIfEl("#redirectBtn");
            console.log("jumpBtn=",jumpBtn);
            jumpBtn.click();
            fixture.detectChanges();
            expect( page.navgateSpy).toHaveBeenCalled();
            done();
        });

    });
});
