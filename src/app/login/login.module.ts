import { NgModule }       from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { ClarityModule } from '@clr/angular';

import { LoginComponent }  from './login.component';

@NgModule({
  imports: [
    ClarityModule.forChild(),
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ],
  declarations: [
    LoginComponent,
  ],
})
export class LoginModule{}
