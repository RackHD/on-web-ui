
/**
 * Lazy module usually doesn't export any components.
 * LoginExpiredComponent is an exception because it just belong to
 * login directory "in logic". It's neither been imported nor declared
 * in login.module. Its declarations is in app.module.
 * The reason is:
 * 1. the component(AppComponent) with a named outlet(loginExpired) must be
 * declared at the same level with its padding component(LoginExpiredComponent)
 * 2. Lazy loading can not be routed to the name outlet.
 */

export { LoginExpiredComponent } from './login-expired.component';

// for unit test
export { LoginModule } from './login.module';
export { LoginComponent } from './login.component';
