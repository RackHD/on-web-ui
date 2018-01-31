/**
 * export the core module for importing it in root module.
 * then all service can be injected.
 */
export { AppCoreModule } from './core.module';

/**
 * export services' class in support of importing in app wide.
 */
export { DataResolver } from './app.resolver';
export { AuthGuard } from './auth-guard.service';
export { UnAuthGuard } from './un-auth-guard.service';

export { IconService } from './icon.service';
export { AuthService } from './auth.service';

export { AuthInterceptor } from './app.interceptor';
export { UserService } from './user.service';
