import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login.component';
import { LoginExpiredComponent } from './login-expired.component';
import { ForgetPasswordsComponent } from './forget-password.component';


const loginRoutes: Routes = [
    { path: '', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(loginRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class LoginRoutingModule { }
