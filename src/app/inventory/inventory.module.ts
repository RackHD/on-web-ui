import { ClarityModule } from '@clr/angular';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InventoryFooterComponent } from './footer/footer.component';
import { InventoryHeaderComponent } from './header/header.component';


@NgModule({
  imports: [
    ClarityModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
  ],
  exports: [
    InventoryFooterComponent,
    InventoryHeaderComponent,
  ],
  declarations: [
    InventoryFooterComponent,
    InventoryHeaderComponent,
  ]
})
export class InventoryModule {}
