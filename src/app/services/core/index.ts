/**
 * export the core module for importing it in root module.
 * then all service can be injected.
 */
export { AppCoreModule } from './core.module';

/**
 * export services' class in support of importing in app wide.
 */
export { DataResolver } from './app.resolver';

export { IconService } from './icon.service';

