import { Component, OnInit } from '@angular/core';
import { Poller, Node, API_PATTERN, ADDR_PATTERN, REPO_PATTERN } from 'app/models';
import { PollersService } from 'app/services/pollers.service';
import { NodeService } from 'app/services/node.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlphabeticalComparator, DateComparator, ObjectFilterByKey, StringOperator }
  from 'app/utils/inventory-operator';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { debounce } from 'rxjs/operator/debounce';
import { CatalogsService } from 'app/services/catalogs.service';
import { JSONEditor } from 'app/utils/json-editor';

@Component({
  selector: 'app-os-install',
  templateUrl: './os-install.component.html',
  styleUrls: ['./os-install.component.scss']
})

export class OsInstallComponent implements OnInit {
  OS_TYPE_VERSION = {};
  OS_TYPE_NAME = {};
  REPO_PLACE_HOLDER = {};

  allNodes: Node[];
  dataStore: Node[];
  allOsTypes: string[];

  diskOptions: Array<string>;
  networkDeviceOptions: Array<string>;
  diskOptionsReady: boolean;
  modifyDefaultSetting: boolean;

  payloadForm: FormGroup;
  payloadJson: {};

  selectedNodeId: string;
  selectedNetworkDevice: string;
  editor: any;
  selectedRepoPlaceHolder: string;

  enableOsinstall = false;
  enableSavePayload = false;
  submitSuccess = false;
  enableNetworkSetting = false;

  searchTerms = new Subject<string>();

  constructor(public nodeService: NodeService, public catalogsService: CatalogsService,
    private fb: FormBuilder) {
  };

  ngOnInit() {
    this.OS_TYPE_VERSION = {
      'esxi': ['6.5', '6', '5.5'],
      'centos': ['7', '6.5'],
      'rhel': ['7.0', '7.1', '7.2'],
      'ubuntu': ['trusty', 'xenial', 'artful'],
    };
    this.OS_TYPE_NAME = {
      'esxi': 'Graph.InstallESXi',
      'centos': 'Graph.InstallCentOS',
      'ubuntu': 'Graph.InstallUbuntu',
      'rhel': 'Graph.InstallRHEL',
    };

    this.REPO_PLACE_HOLDER = {
      '' : 'Select OS TYPE first.',
      'esxi': 'http://172.31.128.2:9090/common/esxi/6.5',
      'centos': 'http://172.31.128.2:9090/common/centos/7/os/x86_64',
      'ubuntu': 'http://172.31.128.2:9090/common/ubuntu/16.04',
      'rhel': 'http://172.31.128.2:9090/common/rhel/7.1/os/x86_64',
    };

    this.selectedRepoPlaceHolder = 'Select OS TYPE first.';

    let container = document.getElementById('jsoneditor');
    let options = { mode: 'code' };
    this.editor = new JSONEditor(container, options);

    this.allOsTypes = Object.keys(this.OS_TYPE_VERSION);
    this.modifyDefaultSetting = false;
    this.getAllNodes();
    this.createForm();

    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchIterm(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
  }

  searchIterm(term: string): void {
    this.allNodes = this.dataStore;
    if (this.payloadForm.value['nodeModel']) {
      this.allNodes = StringOperator.search(term, this.allNodes);
    }
    if (this.payloadForm.value['manufacturer']) {
      this.allNodes = StringOperator.search(term, this.allNodes);
    }
    if (this.payloadForm.value['macName']) {
      this.allNodes = StringOperator.search(term, this.allNodes);
    }
    if (this.payloadForm.value['nodeId']) {
      this.allNodes = StringOperator.search(term, this.allNodes);
    }
  }

  getAllNodes(): void {
    this.nodeService.getAllNodes()
      .subscribe(data => {
        this.allNodes = data;
        this.dataStore = data;
        for (let node of this.allNodes) {
          this.catalogsService.getSource(node.id, 'dmi').subscribe(
            item => {
              let systemInfo = item['data']['System Information'];
              if (systemInfo) {
                node.manufacturer = systemInfo['Manufacturer'];
                node.model = systemInfo['Product Name'];
              }
            }
          );
        }
      });
  }

  createForm() {
    this.payloadForm = this.fb.group({
      osType: '',
      nodeId: new FormControl('', { validators: [Validators.required] }),
      workflowName: '',
      version: '',
      rootPassword: 'RackHDRocks!',
      dnsServers: '',
      networkDevice: '',
      installDisk: '',
      ipAddress: '',
      gateway: '',
      netmask: '',
      repoUrl: new FormControl('', { validators: [Validators.pattern(REPO_PATTERN), Validators.required] }),
      nodeModel: '',
      manufacturer: '',
      macName: ''
    });
  }

  onChange(item) {
    this.selectedNodeId = item;
    this.getInstallDisk(this.selectedNodeId, 'driveId');
    this.getNetworkDevice(this.selectedNodeId, 'ohai');
  }

  onNodeChange(item) {
    this.search(item);
  }

  onNodeIdChange(item) {
    this.onNodeChange(item);
    this.onChange(item);
    this.validSave();
  }

  onChangeOsType(item) {
    this.payloadForm.value['workflowName'] = this.OS_TYPE_NAME[item];
    this.selectedRepoPlaceHolder = this.REPO_PLACE_HOLDER[item];
  }

  onChangeNetworkDevice(item: string) {
    if (item) {
      this.enableNetworkSetting = true;
      this.modifyDefaultSetting = true;
    } else {
      this.enableNetworkSetting = false;
      this.modifyDefaultSetting = false;
    }
    let device = _.split(item, ',');
    this.selectedNetworkDevice = device[0];
  }

  getInstallDisk(nodeId: string, source: string): void {
    this.diskOptions = new Array();
    this.catalogsService.getSource(nodeId, source).subscribe(
      data => {
        let diskData = data['data'];
        for (let disk of diskData) {
          this.diskOptions.push(disk['devName']);
        }
        this.diskOptionsReady = true;
      }
    );
  }

  getNetworkDevice(nodeId: string, source: string): void {
    this.networkDeviceOptions = new Array();
    this.catalogsService.getSource(nodeId, source).subscribe(
      iterm => {
        let usableInterface = [];
        let interfaceObj = iterm.data.network.interfaces;
        let keys = Object.keys(interfaceObj);
        for (let key of keys) {
          if (key.startsWith('eth')) {
            usableInterface.push(key);
            let interfaceKey = key + ', mac:' + Object.keys(interfaceObj[key]['addresses'])[0];
            this.networkDeviceOptions.push(interfaceKey);
          }
        }
      }
    );
  }

  createPayload() {
    this.payloadJson = this.createPayloadOptions();
    this.editor.set(this.payloadJson);
    this.enableOsinstall = true;
  }

  handleEnabled(value: boolean) {
    this.enableNetworkSetting = value;
  }

  onSubmit() {
    let workflow = this.editor.get();
    this.payloadJson = workflow;
    this.nodeService.postWorkflow(this.selectedNodeId,
      this.OS_TYPE_NAME[this.payloadForm.value['osType']], JSON.stringify(this.payloadJson))
      .subscribe(data => {
        this.submitSuccess = true;
      });
  }

  createPayloadOptions(): object {
    let tmpJson = {};
    let generalJson = {};
    let version = { 'version': this.payloadForm.value['version'] };
    let repo = { 'repo': this.payloadForm.value['repoUrl'] };
    let rootPassword = { 'rootPassword': this.payloadForm.value['rootPassword'] };
    let installDisk = {};
    if (this.payloadForm.value['osType'] === 'ubuntu') {
      let ubuntuOnly = {
        'baseUrl': 'install/netboot/ubuntu-installer/amd64',
        'kargs': {
          'live-installer/net-image': this.payloadForm.value['repoUrl'] + '/ubuntu/install/filesystem.squashfs'
        }
      };
      _.assign(generalJson, ubuntuOnly);
    }
    if (this.payloadForm.value['osType'] === 'esxi') {
      installDisk = { 'installDisk': this.payloadForm.value['installDisk'] };
    } else {
      installDisk = { 'installDisk': "/dev/" + this.payloadForm.value['installDisk'] };
    }
    _.assign(generalJson, version, repo, rootPassword, installDisk);

    if (this.enableNetworkSetting) {
      let dnsServers = { 'dnsServers': this.payloadForm.value['dnsServers'] };
      _.assign(generalJson, dnsServers);

      let ipv4 = {
        "ipAddr": this.payloadForm.value['ipAddress'],
        "gateway": this.payloadForm.value['gateway'],
        "netmask": this.payloadForm.value['netmask']
      };

      if (this.payloadForm.value['osType'] === 'esxi') {
        let vmnic = 'vmnic' + this.selectedNetworkDevice.substring(3);
        let networkDevices = {
          'networkDevices': [{
            "device": vmnic,
            "ipv4": ipv4
          }]
        };
        _.assign(generalJson, networkDevices);
      } else {
        let networkDevices = {
          'networkDevices': [{
            "device": this.selectedNetworkDevice,
            "ipv4": ipv4
          }]
        };
        _.assign(generalJson, networkDevices);
      }
    }
    tmpJson = _.assign(tmpJson, {options: {'defaults': generalJson}});
    return tmpJson;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  formClassInvalid(value: string): boolean {
    return this.payloadForm.get(value).invalid;
  }

  validSave() {
    this.enableSavePayload = (!this.formClassInvalid('nodeId')) &&
      (!this.formClassInvalid('repoUrl'));
  }
}
