import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule ,
  FormBuilder, FormGroup,FormControl, Validators }   from '@angular/forms';
import { EmailValidator } from '@angular/forms';

import { rackhdConfig, apiPattern, addrPattern } from '../models/index';

import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})

export class SettingComponent implements OnInit{
  submitted : boolean;
  rackhdAuthEnabled : boolean;
  rackhdSslEnabled : boolean;
  settingFormGroup: any;

  constructor () {
  };

  ngOnInit(){
    this.createForm();
    this.submitted = false;
    this.rackhdAuthEnabled = this.enableAuth;
    this.rackhdSslEnabled = this.enableSSL;
    window.localStorage.clear(); //Krein TODO: clear is required
    console.log(rackhdConfig);
    console.log(window.localStorage);
  }

  createForm() {
    this.settingFormGroup = new FormGroup({
      rackhdNorthboundApi: new FormControl(this.rackhdAPI, Validators.pattern(apiPattern)),
      rackhdWebsocketUrl: new FormControl(this.rackhdWSS, Validators.pattern(addrPattern)),
      rackhdElasticApi: new FormControl(this.elasticsearchAPI, Validators.pattern(addrPattern)),
      rackhdAuth: new FormGroup({
        rackhdPassword: new FormControl({value: '', disabled: this.enableAuth}),//Krein: Suggestion by browser
        rackhdUsername: new FormControl({value: '', disabled: this.enableAuth}),
        rackhdAuthToken: new FormControl({value: '', disabled: this.enableAuth})
      })
    });
  }

  setDefaultSettings() {
    this.settingFormGroup.reset();
  }

  getConfigValue(key) {
    return window.localStorage.getItem(key) || rackhdConfig[key];
  }

  setConfigValue(key, value) {
    //rackhdConfig[key] = value;
    window.localStorage.setItem(key, value);
    return value;
  }


  get rackhdAPI():string { return this.getConfigValue('northboundApi'); }
  set rackhdAPI(value:string) { this.setConfigValue('northboundApi', value); }

  get rackhdWSS():string { return this.getConfigValue('websocketUrl'); }
  set rackhdWSS(value:string) { this.setConfigValue('websocketUrl', value); }

  get elasticsearchAPI():string { return this.getConfigValue('elasticSearchUrl'); }
  set elasticsearchAPI(value:string) { this.setConfigValue('elasticSearchUrl', value); }

  get enableAuth():boolean { return this.getConfigValue('authEnabled'); }
  set enableAuth(value:boolean) { this.setConfigValue('authEnabled', !!value);}

  get enableSSL():boolean { return this.getConfigValue('connSecured'); }
  set enableSSL(value:boolean) { this.setConfigValue('connSecured', !!value); }

  get rackhdAuthToken():string { return this.getConfigValue('autoToken'); }
  set rackhdAuthToken(value:string) { this.setConfigValue('autoToken', value); }

  formClassInvalid(value) {
    return this.settingFormGroup.get(value).invalid
      && (this.settingFormGroup.get(value).dirty
      || this.settingFormGroup.get(value).touched);
  }

  onSubmit() {
    //this.settingFormGroup.reset(); //Krein: Set values to null instead of default value
    this.elasticsearchAPI = this.settingFormGroup.get('rackhdElasticApi').value;
    this.enableAuth = this.rackhdAuthEnabled;
    this.enableSSL = this.rackhdSslEnabled;
    this.rackhdWSS = this.settingFormGroup.get('rackhdWebsocketUrl').value;
    this.rackhdAPI = this.settingFormGroup.get('rackhdNorthboundApi').value;
    this.rackhdAuthToken = this.settingFormGroup.get('rackhdAuth.rackhdAuthToken').value;
    this.submitted = false;
  }

}
