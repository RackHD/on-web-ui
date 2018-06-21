import { Routes } from '@angular/router';

import { NoContentComponent } from './no-content/no-content.component';

/**
 * The order or route is important.
 * Never put a Guard with canActivateChild to path '', then all the loadChildren
 * route after '' will be denied. Cause angular will regard all routes as '' children
 */
export const ROUTES: Routes = [
  {path: '', redirectTo: '/managementCenter/nodes', pathMatch: 'full'},
  {
    path: 'managementCenter',
    loadChildren: 'app/management-center/management-center.module#ManagementCenterModule',
  },
  {
    path: 'workflowCenter',
    loadChildren: 'app/workflow-center/workflow-center.module#WorkflowCenterModule',
  },
  {
    path: 'solutionCenter',
    loadChildren: 'app/solution-center/solution-center.module#SolutionCenterModule',
  },
  // 404 page, page with ** can not be lazily loaded.
  {path: '**', component: NoContentComponent},
];
