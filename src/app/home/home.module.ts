import { NgModule }       from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import { HomeComponent }  from './home.component';
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule
  ],
  declarations: [
    HomeComponent,
  ],
  providers: []
})
export class HomeModule {}
