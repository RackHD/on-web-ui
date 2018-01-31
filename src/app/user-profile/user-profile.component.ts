import { Component, OnInit } from '@angular/core';
import { User } from '../models/index';
import { Router   } from '@angular/router';
import { EmailValidator } from '@angular/forms';
import { UserService } from '../services/core/index';
import { AuthService }      from '../services/core/index';

import * as _ from 'lodash';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    user: User;
    URL: any = { kibana:"", grafana:"", prometheus:"", alertManager:""};
    
    constructor(
        public authService: AuthService,
        private userService: UserService,
        private router: Router
    ){

    }

    ngOnInit() {
        let loginUser = this.authService.loginUser;
        this.user = this.userService.getUserByName( loginUser );

    }

    updateProfile( newEmail: HTMLInputElement ){
        if(  newEmail.value.length > 0 ){
            this.user.email  = newEmail.value;
        }
        this.userService.updateUser( this.user );
        location.reload();// refresh page
    }
    restoreDefault(){
        //this.setDefault.setDefaultValues(true);
        location.reload();// refresh page
    }
}
