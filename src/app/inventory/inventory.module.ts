import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { FormsModule } from '@angular/forms';

import { InventoryRoutingModule } from './inventory-routing.module';

import { InventoryListComponent } from './inventory-list.component';
import { InventoryService } from '../services/inventory.service';

import { TreeModule } from 'angular-tree-component';

@NgModule({
  imports: [
    InventoryRoutingModule,
    CommonModule,
    FormsModule,
    ClarityModule.forChild(),
    TreeModule,
   ],
  declarations: [
    InventoryListComponent
   ],
  providers: [ InventoryService ]
})

export class InventoryModule {}
