import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SettingComponent } from './setting-form.component';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule.forChild(),
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SettingComponent], //Krein: why we must desclare
    exports: [SettingComponent] //Krein: why we must exports, use import in app.module.ts doesn't work.
})
export class SettingModule { }
