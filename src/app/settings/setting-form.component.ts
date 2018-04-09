import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule ,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { API_PATTERN, ADDR_PATTERN } from '../models/index';

import { SettingService } from './setting.service';

import { ClarityModule } from '@clr/angular';

import * as _ from 'lodash';

@Component({
  selector: 'app-setting-form',
  templateUrl: './setting-form.component.html',
  styleUrls: ['./setting-form.component.scss']
})

export class SettingComponent implements OnInit, OnDestroy {
  @Output() onSave: EventEmitter<boolean> = new EventEmitter<boolean>();

  submitted : boolean;
  settingFormGroup: FormGroup;

  constructor (public settingService: SettingService) {
  };

  ngOnInit(){
    this.settingService.loadInitialConfig();
    this.settingService.loadInitialConfig();
    this.createForm();
    this.submitted = false;
  }

  createForm() {
    this.settingFormGroup = new FormGroup({
      rackhdNorthboundApi: new FormControl(
        this.settingService.northboundApi,
        {validators: [Validators.pattern(API_PATTERN), Validators.required]}
      ),
      rackhdWebsocketUrl: new FormControl(
        this.settingService.websocketUrl,
        {validators: [Validators.pattern(ADDR_PATTERN), Validators.required]}
      ),
      rackhdElasticApi: new FormControl(
        this.settingService.elasticSearchUrl, Validators.pattern(ADDR_PATTERN)
      ),
      rackhdAuth: new FormGroup({
        rackhdPassword: new FormControl(
          {value:'', disabled: !this.settingService.authEnabled},
          {validators: [ Validators.required]}
        ),
        rackhdUsername: new FormControl(
          {value:'', disabled: !this.settingService.authEnabled},
          {validators: [ Validators.required]}
        ),
        rackhdAuthToken: new FormControl(
          {value:'', disabled: !this.settingService.authEnabled}
        )
      })
    });
  }

  resetSettings() {
    let defaultConfig = this.settingService.loadDefaultConfig();
    this.settingFormGroup.reset({
      rackhdNorthboundApi: defaultConfig.northboundApi,
      rackhdWebsocketUrl: defaultConfig.websocketUrl,
      rackhdElasticApi: defaultConfig.elasticSearchUrl,
      rackhdAuth: {
        rackhdPassword: {value:'', disabled: !defaultConfig.authEnabled},
        rackhdUsername: {value:'', disabled: !defaultConfig.authEnabled},
        rackhdAuthToken: {value:'', disabled: !defaultConfig.authEnabled},
      }
    });
    this.submitted = false;
  }

  formClassInvalid(value: string): boolean {
    return this.settingFormGroup.get(value).invalid;
    //  && (this.settingFormGroup.get(value).dirty
    //  || this.settingFormGroup.get(value).touched);
  }

  generateTokenDisabled(): boolean {
    return this.formClassInvalid('rackhdAuth.rackhdUsername')
      || this.formClassInvalid('rackhdAuth.rackhdPassword')
      || !this.settingService.authEnabled;
  }

  saveButtonDisabled(): boolean {
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
    this.submitFormValues();
    this.settingService.generateToken(
      this.settingFormGroup.get('rackhdAuth.rackhdUsername').value,
      this.settingFormGroup.get('rackhdAuth.rackhdPassword').value
    ).subscribe(
      data => {
        this.settingService.authToken = data["token"];
        this.settingFormGroup.patchValue({
          rackhdAuth: {
            rackhdAuthToken: this.settingService.authToken || ''
          }
        });
        this.submitted = false;
      }
    );
  }
  
  submitFormValues(){
    this.settingService.websocketUrl = this.settingFormGroup.get('rackhdWebsocketUrl').value;
    this.settingService.northboundApi = this.settingFormGroup.get('rackhdNorthboundApi').value;
    this.settingService.elasticSearchUrl = this.settingFormGroup.get('rackhdElasticApi').value;
    this.settingService.authToken = this.settingFormGroup.get('rackhdAuth.rackhdAuthToken').value;
  }

  onSubmit() {
    this.submitFormValues();
    this.submitted = false;
    this.onSave.emit(true);
  }

  ngOnDestroy(){
    // this.settingService.clearAllConfig();
  };


}
