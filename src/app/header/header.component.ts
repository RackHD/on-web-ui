import { Component } from '@angular/core';
import { AuthService } from '../services/core/index';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { EnvironmentService } from '../services/environment.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  demoMode:boolean;
  modeSwitchModalOpened = false;
  constructor(
    public router: Router,
    public authService: AuthService,
    private location: Location
  ){
      this.demoMode = false;
  }

  logout(){
    this.authService.logout();
    this.goTo('login');
  }

  public goTo( path: string ){
    this.router.navigate( [path] );
  }

  public onSwitchMode(){
      this.modeSwitchModalOpened = true;
      this.demoMode = ! this.demoMode;
  }

  public onModalClosed(){
    this.modeSwitchModalOpened = false;
    location.reload();// refresh page to re-init the app

  }

}
