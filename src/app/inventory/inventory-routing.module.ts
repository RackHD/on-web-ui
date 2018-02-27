import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceDetailComponent } from './device-detail.component';

import { InventoryListComponent } from './inventory-list.component';

const inventoryRoutes: Routes = [
  { path: '', component: InventoryListComponent },
  { path: ':type', component: InventoryListComponent },
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
