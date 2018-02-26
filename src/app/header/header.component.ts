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
  openSetting =  false;

  ngOnInit() {
    this.selectedTab = window.location.pathname;
  }

  constructor() {
  }

  popSettings(){
    this.openSetting = true;
  }
}
