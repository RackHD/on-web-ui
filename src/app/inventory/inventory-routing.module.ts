import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceDetailComponent } from './device-detail.component';


import { AuthGuard } from '../services/core/index';

import { InventoryListComponent } from './inventory-list.component';

const inventoryRoutes: Routes = [
  { path: '', component: InventoryListComponent, canLoad: [AuthGuard] },
  { path: ':type', component: InventoryListComponent, canLoad: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forChild(inventoryRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class InventoryRoutingModule { }
