import { async, ComponentFixture, fakeAsync, TestBed, tick, discardPeriodicTasks
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SpyLocation }         from '@angular/common/testing';
import { SpyNgModuleFactoryLoader } from '@angular/router/testing';

import { Router } from '@angular/router';
import { NgModuleFactoryLoader, DebugElement, Type, NO_ERRORS_SCHEMA
}    from '@angular/core';
import { By }                 from '@angular/platform-browser';
import { Location }           from '@angular/common';

import { AppModule }              from './app.module';
import { AppComponent }           from './app.component';
import { LoginModule, LoginComponent }         from './login/index';
import { HomeModule, HomeComponent } from './home/index';
import { AuthGuard, UnAuthGuard, UserService } from './services/core/index';

let comp:     AppComponent;
let fixture:  ComponentFixture<AppComponent>;
let router:   Router;
let location: SpyLocation;
let loader: SpyNgModuleFactoryLoader;
let authGuard: AuthGuard;
let unAuthGuard: UnAuthGuard;
let userService: UserService;

////// Helpers /////////

/** Wait a tick, then detect changes */
function advance(): void {
  tick();
  fixture.detectChanges();
}

/** begin test router, check the real components loading.
  * Only compinents has <router-outlet> need this kind of test.
  */
function createTrueComponent() {
  fixture = TestBed.createComponent(AppComponent);
  comp = fixture.componentInstance;

  const injector = fixture.debugElement.injector;
  location = injector.get(Location) as SpyLocation;
  router = injector.get(Router);

  // stub lazy loaded modules
  loader   = TestBed.get(NgModuleFactoryLoader);
  loader.stubbedModules = {
    homeModule: HomeModule,
    loginModule: LoginModule
  };
  // reconfig necessary routes, make sure this totally the same with true routes.
  router.resetConfig([
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadChildren: 'homeModule', canLoad: [AuthGuard]},
    { path: 'login', loadChildren: 'loginModule', canLoad: [UnAuthGuard] },
  ]);

  // init guard for spy
  authGuard = TestBed.get(AuthGuard);
  unAuthGuard = TestBed.get(UnAuthGuard);
  userService = TestBed.get(UserService);
}

function expectElementOf(type: Type<any>): any {
  const el = fixture.debugElement.query(By.directive(type));
  expect(el).toBeTruthy('expected an element for ' + type.name);
  return el;
}

describe('AppComponent', () => {
    describe('AppComponent Router Test', () => { testRouter()});
});

function testRouter() {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule, RouterTestingModule ]
    });
  }));

  beforeEach(fakeAsync(() => {
      createTrueComponent();
  }));

  it('should navigate to "/" immediately', fakeAsync(() => {
      router.initialNavigation();
      expect(location.path()).toEqual('', 'after initialNavigation()');
      advance();
      advance();
  }));

  it('should then redirectTo "home" if logged', fakeAsync(() => {
      spyOn(authGuard, 'checkLogin').and.returnValue(true);
      spyOn(userService, 'getCurrentUser').and.returnValue({username: 'whatever'});
      router.initialNavigation();
      advance();
      expect(location.path()).toEqual('/home', 'redirecting to home');
      expectElementOf(HomeComponent);
      discardPeriodicTasks();
  }));

  it('should then redirectTo "login" if unlogged', fakeAsync(() => {
      router.initialNavigation();
      advance();
      advance();
      expect(location.path()).toEqual('/login', 'redirecting to home');
      expectElementOf(LoginComponent);
  }));
};
/**
 * End router test.
 */
