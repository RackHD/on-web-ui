import { Component }        from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router,
         NavigationExtras } from '@angular/router';
import { AuthService }      from '../services/core/index';

@Component({
  templateUrl: './login-expired.component.html',
  styleUrls: []
})

export class LoginExpiredComponent {
  constructor(
    private router: Router,
    private authService: AuthService
  ){}

  modalOpen = true;

  reLogin(){
    this.authService.clearLoginData();
    this.router.navigate(['/login']);
  }
}
