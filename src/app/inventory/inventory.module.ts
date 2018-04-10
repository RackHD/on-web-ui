
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { CommonModule } from '@angular/common';

import { InventoryFooterComponent } from './footer/footer.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClarityModule,
  ],
  exports: [
    InventoryFooterComponent,
  ],
  declarations: [
    InventoryFooterComponent,
  ]
})
export class InventoryModule {}
