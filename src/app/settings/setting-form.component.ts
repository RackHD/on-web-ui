import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule ,
  FormBuilder, FormGroup,FormControl, Validators }   from '@angular/forms';

import { apiPattern, addrPattern } from '../models/index';

import { SettingService } from './setting.service';

import { ClarityModule } from '@clr/angular';

import * as _ from 'lodash';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})

export class SettingComponent implements OnInit, OnDestroy {
  submitted : boolean;
  settingFormGroup: FormGroup;

  constructor (public settings: SettingService) {
  };

  ngOnInit(){
    this.settings.loadDefaultConfig();
    this.createForm();
    this.submitted = false;
  }

  createForm() {
    this.settingFormGroup = new FormGroup({
      rackhdNorthboundApi: new FormControl(
        this.settings.northboundApi,
        {validators: [Validators.pattern(apiPattern), Validators.required]}
      ),
      rackhdWebsocketUrl: new FormControl(
        this.settings.websocketUrl,
        {validators: [Validators.pattern(addrPattern), Validators.required]}
      ),
      rackhdElasticApi: new FormControl(
        this.settings.elasticSearchUrl, Validators.pattern(addrPattern)
      ),
      rackhdAuth: new FormGroup({
        rackhdPassword: new FormControl(
          {value:'', disabled: !this.settings.authEnabled},
          {validators: [ Validators.required]}
        ),
        rackhdUsername: new FormControl(
          {value:'', disabled: !this.settings.authEnabled},
          {validators: [ Validators.required]}
        ),
        rackhdAuthToken: new FormControl(
          {value:'', disabled: !this.settings.authEnabled}
        )
      })
    });
  }

  resetSettings() {
    this.settings.loadDefaultConfig();
    this.settingFormGroup.reset({
      rackhdNorthboundApi: this.settings.northboundApi,
      rackhdWebsocketUrl: this.settings.websocketUrl,
      rackhdElasticApi: this.settings.elasticSearchUrl,
      rackhdAuth: {
        rackhdPassword: {value:'', disabled: !this.settings.authEnabled},
        rackhdUsername: {value:'', disabled: !this.settings.authEnabled},
        rackhdAuthToken: {value:'', disabled: !this.settings.authEnabled},
      }
    });
    this.submitted = false;
  }

  formClassInvalid(value) {
    return this.settingFormGroup.get(value).invalid;
    //  && (this.settingFormGroup.get(value).dirty
    //  || this.settingFormGroup.get(value).touched);
  }

  generateTokenDisabled() {
    return this.formClassInvalid('rackhdAuth.rackhdUsername')
      || this.formClassInvalid('rackhdAuth.rackhdPassword')
      || !this.settings.authEnabled;
  }

  saveButtonDisabled() {
    return this.settingFormGroup.invalid
      || !(this.generateTokenDisabled() || this.settingFormGroup.get("rackhdAuth.rackhdAuthToken").value);
  }

  handleAuthEnabled(value: boolean) {
    let authItems = ["rackhdPassword", "rackhdUsername", "rackhdAuthToken"];
    _.forEach(authItems, (item) => {
      let formItem = this.settingFormGroup.get('rackhdAuth.' + item);
      value ? formItem.enable() : formItem.disable();
    })
  }

  generateToken(){
    this.onSubmit();
    this.settings.generateToken(
      this.settingFormGroup.get('rackhdAuth.rackhdUsername').value,
      this.settingFormGroup.get('rackhdAuth.rackhdPassword').value
    ).subscribe(
      data => {
        this.settings.authToken = data["token"];
        this.settingFormGroup.patchValue({
          rackhdAuth: {
            rackhdAuthToken: this.settings.authToken || ''
          }
        });
        this.submitted = false;
    }
  );
  }

  onSubmit() {
    this.settings.websocketUrl = this.settingFormGroup.get('rackhdWebsocketUrl').value;
    this.settings.northboundApi = this.settingFormGroup.get('rackhdNorthboundApi').value;
    this.settings.elasticSearchUrl = this.settingFormGroup.get('rackhdElasticApi').value;
    this.settings.authToken = this.settingFormGroup.get('rackhdAuth.rackhdAuthToken').value;
    this.submitted = false;
  }

  ngOnDestroy(){
    this.settings.clearAllConfig();
  };
}
