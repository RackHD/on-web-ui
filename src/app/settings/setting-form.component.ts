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

export class SettingComponent {
  submitted = false;
  settingClicked = false;

  settingFormGroup = new FormGroup({
    rackhdNorthboundApi: new FormControl('', Validators.pattern(apiPattern)),
    rackhdWsUrl: new FormControl('', Validators.pattern(addrPattern)),
    rackhdElasticApi: new FormControl('', Validators.pattern(addrPattern)),
    rackhdSslEnabled: new FormControl(''),
    rackhdAuthEnabled: new FormControl(''),
    rackhdPassword: new FormControl({value: '', disabled: this.enableAuth}),//Krein: Suggestion by browser
    rackhdUsername: new FormControl({value: '', disabled: this.enableAuth}),
    rackhdAuthToken: new FormControl({value: '', disabled: this.enableAuth}),
  });

  constructor () {};

  onSubmit() {
    this.settingFormGroup.reset();
    this.submitted = false;
  }

  setDefaultSettings() {
    this.settingFormGroup.reset();
  }

  getConfigValue(key) {
    return window.localStorage.getItem(key) || rackhdConfig[key];
  }

  setConfigValue(key, value) {
    window.localStorage.setItem(key, (rackhdConfig[key] = value));
    return value;
  }

  get elasticsearchAPI() { return this.getConfigValue('elasticSearchUrl'); }
  set elasticsearchAPI(value) { this.setConfigValue('elasticSearchUrl', value); }

  get enableAuth() { return this.getConfigValue('authEnabled'); }
  set enableAuth(value) { this.setConfigValue('authEnabled', !!value);}

  get enableSSL() { return this.getConfigValue('connSecured'); }
  set enableSSL(value) { this.setConfigValue('connSecured', !!value); }

  get rackhdWSS() { return this.getConfigValue('websocketUrl'); }
  set rackhdWSS(value) { this.setConfigValue('websocketUrl', value); }

  get rackhdAPI() { return this.getConfigValue('northboundApi'); }
  set rackhdAPI(value) { this.setConfigValue('northboundApi', value); }

  get rackhdAuthToken() { return this.getConfigValue('autoToken'); }
  set rackhdAuthToken(value) { this.setConfigValue('autoToken', value); }

  formClassInvalid (value) {
    return this.settingFormGroup.get(value).invalid
      && (this.settingFormGroup.get(value).dirty
        || this.settingFormGroup.get(value).touched);
  }

  updateSettings() {
    this.settingFormGroup.reset();
    this.elasticsearchAPI = this.settingFormGroup.get('rackhdElasticApi').value;
    this.enableAuth = this.settingFormGroup.get('rackhdAuthEnabled').value;
    this.enableSSL = this.settingFormGroup.get('rackhdSslEnabled').value;
    this.rackhdWSS = this.settingFormGroup.get('rackhdWsUrl').value;
    this.rackhdAPI = this.settingFormGroup.get('rackhdNorthBoundApi').value;
    this.rackhdAuthToken = this.settingFormGroup.get('rackhdAuthToken').value;
    this.submitted = false;
  }

}
