import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupFormComponent } from './signup-form.component';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule.forChild(),
        SignupRoutingModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [SignupFormComponent]
})
export class SignupModule { }
