import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from '../services/environment.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  showSettingModal = false;
  selectedTab = '';

  ngOnInit() {
    this.selectedTab = window.location.pathname;
  }

  constructor() {
  }

  // demoMode:boolean;
  // modeSwitchModalOpened = false;
  // constructor(
  //   public router: Router,
  //   public authService: AuthService,
  //   private location: Location
  // ){
  //     this.demoMode = false;
  // }
  //
  // logout(){
  //   this.authService.logout();
  //   this.goTo('login');
  // }
  //
  // public goTo( path: string ){
  //   this.router.navigate( [path] );
  // }
  //
  // public onSwitchMode(){
  //     this.modeSwitchModalOpened = true;
  //     this.demoMode = ! this.demoMode;
  // }
  //
  // public onModalClosed(){
  //   this.modeSwitchModalOpened = false;
  //   location.reload();// refresh page to re-init the app
  //
  // }

}
