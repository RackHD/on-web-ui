/**
 * route with ** doesn't support lazy loading components, so this module must be
 * exported for app.moule importing. Then app.moule can just use NoContentComponent
 * in 404 route.
 */
export { NoContentModule } from './no-content.module';
