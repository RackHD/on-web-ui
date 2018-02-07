import { Routes } from '@angular/router';

import { DataResolver } from './app.resolver';
import { AuthGuard } from './services/core/index';


import { NoContentComponent } from './no-content/no-content.component';
import { OperationsCenterModule } from './operations-center/operations-center.module';


export const ROUTES: Routes = [
  /**
   * The order or route is important.
   * Never put a Guard with canActivateChild to path '', then all the loadChildren
   * route after '' will be denied. Cause angular will regard all routes as '' children
   */


  /**
   * @description Four first-level routings
   * @date 2018-02-07 18:52:36
   * @author flower
   */
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {
    path: 'managementCenter',
    loadChildren: 'app/management-center/management-center.module#ManagementCenterModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'operationsCenter',
    loadChildren: 'app/operations-center/operations-center.module#OperationsCenterModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'solutionCenter',
    loadChildren: 'app/solution-center/solution-center.module#SolutionCenterModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'workflowEditor',
    loadChildren: 'app/workflow-editor/workflow-editor.module#WorkflowEditorModule',
    canLoad: [AuthGuard]
  },
  // 404 page, page with ** can not be lazily loaded.
  {path: '**', component: NoContentComponent},
  /* ==============分割线==============*/
  //{ path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule', canLoad: [UnAuthGuard] },
  // {path: 'home', loadChildren: 'app/home/home.module#HomeModule', canLoad: [AuthGuard]},
  // {path: 'login', loadChildren: 'app/login/login.module#LoginModule', canLoad: [UnAuthGuard]}, //without parameter
  // {path: 'login/:user', loadChildren: 'app/login/login.module#LoginModule', canLoad: [UnAuthGuard]}, // with parameter
  // {path: 'profile', loadChildren: 'app/user-profile/user-profile.module#UserProfileModule', canLoad: [AuthGuard]},
  // {path: 're-login', component: LoginExpiredComponent, outlet: 'loginExpired'},
  // {path: 'profile', loadChildren: 'app/user-profile/user-profile.module#UserProfileModule', canLoad: [AuthGuard]},
  // {path: 'inventory', loadChildren: 'app/inventory/inventory.module#InventoryModule', canLoad: [AuthGuard]}

];
