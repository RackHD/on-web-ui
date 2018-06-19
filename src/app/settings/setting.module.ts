import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SettingComponent } from './setting-form.component';
import { SettingService } from './setting.service';

@NgModule({
  imports: [
    CommonModule,
    ClarityModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  declarations: [SettingComponent],
  exports: [SettingComponent],
  providers: [SettingService]
})
export class SettingModule { }
