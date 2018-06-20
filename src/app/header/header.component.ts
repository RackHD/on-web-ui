import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { EnvironmentService } from '../services/environment.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  showSettingModal = false;
  openSetting =  false;

  ngOnInit() {
  }

  constructor() {}

  popSettings(){
    this.openSetting = true;
  }

  onSettingSave(){
    this.openSetting = false;
  }
}
