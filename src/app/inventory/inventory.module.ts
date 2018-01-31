import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';

import { InventoryRoutingModule } from './inventory-routing.module';

import { InventoryListComponent } from './inventory-list.component';
import { InventoryService } from '../services/inventory.service';

import { DeviceDetailComponent } from './device-detail.component';
import { RackViewComponent } from './rack-view.component';



@NgModule({
  imports: [
    InventoryRoutingModule,
    CommonModule,
    FormsModule,
    ClarityModule.forChild(),
   ],
  declarations: [
    InventoryListComponent,
    DeviceDetailComponent,
    RackViewComponent
   ],
  providers: [ InventoryService ]
})

export class InventoryModule {}
