import {
  Component,
  ViewChild,
  OnInit }        from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,
         NavigationExtras } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

import { AuthService }      from '../services/core/index';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  formModel: any;
  // for login information feedback bar
  loginMessage: string;
  ifLoginSuccess: boolean;

  // for forget password modal
  fpOpen: boolean = false;
  fpInputValid: boolean = false;

  // for password reset feedback bar
  passwordResetInputValue: string;
  passwordResetMessage: string;
  ifPasswordResetSuccess: boolean;

  inputUserName: string; // parameter from the URL(router parameter). example: login/my_name

  constructor(
    public authService: AuthService,
    public router: Router ,
    public route:  ActivatedRoute ,
    private formBuilder: FormBuilder
  ) {
    route.params.subscribe(
          params => { this.inputUserName = params['user']}
    );
    this.createForm();
  }

  ngOnInit(){
    // make sure the login expired disappear when init login page
    this.router.navigate([{ outlets: { loginExpired: null }}]);
  }

  createForm(){
    this.loginForm = this.formBuilder.group({
      user: ['', Validators.required ],
      password: ['', Validators.required],
      rememberMe: [false]
    });
    if( this.inputUserName )
    {
        this.loginForm.controls['user'].setValue( this.inputUserName );
        // if user name appended in the URL, then fill it into input box.
        this.loginInputChange(); // re=valid the input change
    }
  }

//-------------------- login --------------------
  login() {
    this.setLoginMessageBar(true, 'Trying to log in ...');

    const formModel = this.loginForm.value;
    this.authService.login(formModel.user, formModel.password).subscribe(
      data => {
        this.authService.setLoginedStatus(data.token);
        this.setLoginMessageBar(true, 'Logged successfully, redirecting ...');

        if (formModel.rememberMe){
          this.authService.keepLoginStatus(data.token);
        }

        let redirect = this.authService.redirectUrl ? this.authService.redirectUrl : '/home';

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate([redirect], navigationExtras);
      },
      err => {
        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
        if ( err.status === "401"){
          this.setLoginMessageBar(false, "Auth failed, wrong username or password.");
        } else if (err.status === "500"){
          this.setLoginMessageBar(false, "Server is in maintainace, please try again later.");
        }
      });
  }

  logout() {
    this.authService.logout();
  }

  get userNameIsNull(): Boolean{
    return !Boolean(this.loginForm.value.user);
  }

  get passwordIsNull(): Boolean{
    return !Boolean(this.loginForm.value.password);
  }

  loginInputChange(){
      this.loginMessage = "";
  }
  // -------------------- login end --------------------

  // ---------------------- reset password ---------------------
  setLoginMessageBar(status: boolean, message: string){
    this.ifLoginSuccess = status;
    if(message) {this.loginMessage= message};
  }

  showForgetPasswordModal(){
      this.fpOpen = true;
  }

  resetEmailInputChange(inputValue: string){
    this.passwordResetMessage = "";
    this.fpInputValid = inputValue ? true : false;
  }

  resetPassword(email: string){
    this.setPassWordResetBar(true, "Processing...");

    var emailRe = /\S+@\S+\.\S+/;
    if (!emailRe.test(email)){
      this.setPassWordResetBar(false, "Please input valid email address!")
      return;
    }

    this.authService.resetPassword(email).subscribe(
      data => {
        this.setPassWordResetBar(true,
          "An email has been sent, please fllow the link in email to reset your password.")
      },
      err => {
        this.setPassWordResetBar(false, err.error)
      }
    )
  }

  setPassWordResetBar(status: boolean, message: string){
    this.ifPasswordResetSuccess = status;
    if(message) {this.passwordResetMessage = message};
  }
  //-------------------- reset password end --------------------
}
