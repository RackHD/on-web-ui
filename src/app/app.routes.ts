import { Routes } from '@angular/router';

import { DataResolver } from './app.resolver';
import { AuthGuard, UnAuthGuard } from './services/core/index';


import { NoContentComponent } from './no-content/no-content.component';
import { LoginExpiredComponent } from './login/login-expired.component';
import { UserProfileModule } from './user-profile/user-profile.module';


export const ROUTES: Routes = [
  /**
   * The order or route is important.
   * Never put a Guard with canActivateChild to path '', then all the loadChildren
   * route after '' will be denied. Cause angular will regard all routes as '' children
   */
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadChildren: 'app/home/home.module#HomeModule', canLoad: [AuthGuard]},
  { path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule', canLoad: [UnAuthGuard] },
  { path: 'login', loadChildren: 'app/login/login.module#LoginModule', canLoad: [UnAuthGuard] }, //without parameter
  { path: 'login/:user', loadChildren: 'app/login/login.module#LoginModule', canLoad: [UnAuthGuard] }, // with parameter
  { path: 'profile', loadChildren: 'app/user-profile/user-profile.module#UserProfileModule', canLoad: [AuthGuard] },
  { path: 're-login', component: LoginExpiredComponent, outlet: 'loginExpired'},

  // user
  { path: 'profile', loadChildren: 'app/user-profile/user-profile.module#UserProfileModule', canLoad: [AuthGuard] },

  { path: 'inventory', loadChildren: 'app/inventory/inventory.module#InventoryModule', canLoad: [AuthGuard]},

  // 404 page, page with ** can not be lazily loaded.
  { path: '**',component: NoContentComponent }
];
