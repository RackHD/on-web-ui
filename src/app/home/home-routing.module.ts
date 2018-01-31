import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

import { AuthGuard } from '../services/core/index';
const homeRoutes: Routes = [
  { path: '', component: HomeComponent, canLoad: [AuthGuard]}
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HomeRoutingModule { }
