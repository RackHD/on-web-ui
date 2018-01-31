import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { UserProfileRoutingModule } from './user-profile-routing.module';
import { UserProfileComponent } from './user-profile.component';

@NgModule({
    imports: [
        CommonModule,
        ClarityModule.forChild(),
        UserProfileRoutingModule,
    ],
    declarations: [UserProfileComponent]
})
export class UserProfileModule { }
