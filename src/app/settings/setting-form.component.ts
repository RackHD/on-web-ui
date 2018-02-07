import { Component, OnInit } from '@angular/core';
import { Router   } from '@angular/router';
import { FormsModule, ReactiveFormsModule ,
         FormBuilder, FormGroup,FormControl, Validators }   from '@angular/forms'; 
import { EmailValidator } from '@angular/forms';

import { User } from '../models/index';
import { UserService } from '../services/core/index';

@Component({
    selector: 'app-setting-form',
    templateUrl: './setting-form.component.html',
    styleUrls: ['./setting-form.component.css']
})


export class SignupFormComponent implements OnInit {

    signupForm: FormGroup;
    submitted: boolean = false;
    redirectElaspedTime : number = 0;
    redirectTotalTime: number = 5; // wait 5000 ms before redirect to other page

    intervalSet:any;
    timeoutSet:any;

    isUserNameOccupied():boolean{
        return ( this.userService.getUserByName(this.signupForm.value.username) != null );
    }


    /* Model Driven Form */
    get usernameFC() { return this.signupForm.get('username'); }
    get passwordFC() { return this.signupForm.get('password'); }
    get emailFC()    { return this.signupForm.get('email'); }

    createForm(){
        this.signupForm = this.formBuilder.group({
            'username': new FormControl("",
                                         [ Validators.required,
                                           Validators.minLength(3)    ]),   
            'password': new FormControl("",
                                         [ Validators.required,
                                           Validators.minLength(4)    ]),   
            'email': new FormControl("", [ Validators.required    ]), 
        });

    }

    submitForm() {
        this.submitted = true;
        //create a new User by UserService
        let newUser = new User();
        const formModel = this.signupForm.value;
        newUser.username = formModel.username;
        newUser.password = formModel.password;
        newUser.email    = formModel.email;
        this.userService.createUser(newUser);

        this.intervalSet = setInterval( ()=>{ this.redirectElaspedTime += 1; }, 1000);
        this.timeoutSet  = setTimeout((router: Router) => { this.redirectToLoginPage()}, this.redirectTotalTime*1000);
    }

    constructor(
        private userService: UserService,
        private router: Router,
        private formBuilder: FormBuilder

    ){
        this.createForm();
    }

    ngOnDestroy() {
        clearTimeout(this.timeoutSet);
        clearInterval(this.intervalSet);
    }

    ngOnInit() {
        this.submitted = false;
    }

    redirectToLoginPage(){
        this.router.navigate(['login/' + this.signupForm.value.username ]);
    }
}

