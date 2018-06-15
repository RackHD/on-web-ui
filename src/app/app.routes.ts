import { Routes } from '@angular/router';

import { NoContentComponent } from './no-content/no-content.component';

/**
 * The order or route is important.
 * Never put a Guard with canActivateChild to path '', then all the loadChildren
 * route after '' will be denied. Cause angular will regard all routes as '' children
 */
export const ROUTES: Routes = [
  /**
   * @description Four first-level routings
   * @date 2018-02-07 18:52:36
   * @author xiaoyu.chu@emc.com
   */
  {path: '', redirectTo: 'ui/managementCenter', pathMatch: 'full'},
  {
    path: 'ui/managementCenter',
    loadChildren: 'app/management-center/management-center.module#ManagementCenterModule',
  },
  {
    path: 'ui/operationsCenter',
    loadChildren: 'app/operations-center/operations-center.module#OperationsCenterModule',
  },
  {
    path: 'ui/solutionCenter',
    loadChildren: 'app/solution-center/solution-center.module#SolutionCenterModule',
  },
  {
    path: 'ui/workflowEditor',
    loadChildren: 'app/workflow-editor/workflow-editor.module#WorkflowEditorModule',
  },
  // 404 page, page with ** can not be lazily loaded.
  {path: '**', component: NoContentComponent},
];
