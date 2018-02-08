import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
/**
 * IMPORTANT: just import HttpClient only once in app.module
 * Otherwise the interceptor and mock api calling may not work properly.
 */
import { HttpClientModule } from '@angular/common/http';
import {
  NgModule,
  ApplicationRef
} from '@angular/core';
import {
  PreloadAllModules
} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * Third Party Modules
 */
import { ClarityModule } from '@clr/angular';
import { CookieModule } from 'ngx-cookie';

/**
 * Customized Service modules, they are used to inject/provide services.
 */
import { AppRoutingModule } from './app-routing.module';

/**
 * Customized Component/directives/pipe modules, they are used to provide view unit
 */
import { NoContentModule } from './no-content/index';
import { HeaderComponent } from './header/index';
/*
 * Platform and Environment providers
 */
import { environment } from 'environments/environment';

// App is our top level component
import { AppComponent } from './app.component';
import { LoginExpiredComponent } from './login/index';

// Services Modules
import { SharedServicesModule } from './services/sharedServices.module'

/*
 * node_modules js here
 */
import '../../node_modules/@webcomponents/custom-elements/custom-elements.min.js';
import '../../node_modules/prismjs/prism.js';
import '../../node_modules/prismjs/components/prism-typescript.min.js';

/*
 * global css here, scss will be processed by webpack
 */
import '../styles/styles.scss';
import '../styles/headings.css';

// import serives, objs use only in this module.
import {
  IconService,
  AuthService
} from './services/core/index';
/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    LoginExpiredComponent,
    HeaderComponent
  ],
  /**
   * Import Angular's modules.
   */
  imports: [
    BrowserModule,
    ClarityModule.forRoot(),
    CookieModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    SharedServicesModule,
    // Feature module
    NoContentModule,
    /**
     * This section will import the `DevModuleModule` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    ...environment.showDevModule ? [] : [],
  ],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [
    ...environment.ENV_PROVIDERS
  ]
})

export class AppModule {
  constructor(
    public iconService: IconService,
    private authService: AuthService
  ) {
    // must be called once to init IconService
    iconService.load();

    // if token is saved in cookie, use it to login.
    authService.initLoginStatus();
  }
}
