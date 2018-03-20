import { Component, OnInit } from '@angular/core';
import { Poller, Node } from 'app/models';
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
import { environment } from 'environments/environment';
import { JSONEditor } from 'app/utils/json-editor';

@Component({
  selector: 'app-os-install',
  templateUrl: './os-install.component.html',
  styleUrls: ['./os-install.component.scss']
})

export class OsInstallComponent implements OnInit {
  OS_TYPE_VERSION = {};
  OS_TYPE_NAME = {};
  typeArray: string[];

  allNodes: Node[];
  dataStore: Node[];
  allOsTypes: string[];

  diskOptions: Array<string>;
  networkDeviceOptions: Array<string>;
  diskOptionsReady: boolean;
  modifyDefaultSetting: boolean;

  payloadForm: FormGroup;
  payloadJson: {};
  payloadFull: {};

  selectedNodeId: string;
  selectedNetworkDevice: string;
  editor: any;

  enableOsinstall = false;
  submitSuccess = false;
  enableNetworkSetting = false;

  searchTerms = new Subject<string>();

  constructor(public nodeService: NodeService, public catalogsService: CatalogsService,
    private fb: FormBuilder) {
  };

  ngOnInit() {
    this.OS_TYPE_VERSION = {
      'esxi': ['6.5', '6'],
      'centos': ['7'],
      'ubuntu': ['trusty'],
    };
    this.OS_TYPE_NAME = {
      'esxi': 'Graph.InstallESXi',
      'centos': 'Graph.InstallCentOS',
      'ubuntu': 'Graph.InstallUbuntu'
    };

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

  updateEditor() {
    this.editor.set(this.payloadJson);
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
                let model =
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
      nodeId: '',
      workflowName: '',
      version: '',
      rootPassword: 'RackHDRocks!',
      dnsServers: '',
      networkDevice: '',
      installDisk: '',
      ipAddress: '',
      gateway: '',
      netmask: '',
      repoUrl: 'http://172.31.128.2:9090/common',
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
  }

  onChangeOsType(item) {
    this.payloadForm.value['workflowName'] = this.OS_TYPE_NAME[item];
  }

  onChangeNetworkDevice(item: string) {
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
    let payloadTmp = 'Please choose supported OS\'s type.';
    switch (this.payloadForm.value['osType']) {
      case 'centos': {
        payloadTmp = this.createCentosPayload();
        break;
      }

      case 'esxi': {
        payloadTmp = this.createEsxiPayload();
        break;
      }

      case 'ubuntu': {
        payloadTmp = this.createUbuntuPayload();
        break;
      }
      default: {
        break;
      }
    }
    this.payloadJson = JSON.parse(payloadTmp);
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

  createCentosPayload(): string {
    let centosPayload = `
    {
      "options": {
          "defaults": {
              "version": "${this.payloadForm.value['version']}",
              "repo": "${this.payloadForm.value['repoUrl'] + '/' +
      this.payloadForm.value['osType'] + '/' +
      this.payloadForm.value['version'] + '/os/x86_64'}",
              "rootPassword": "${this.payloadForm.value['rootPassword']}",
              "installDisk": "${'/dev/' + this.payloadForm.value['installDisk']}",
              "dnsServers": [
                "${this.payloadForm.value['dnsServers']}"
              ],
              "networkDevices": [
                {
                  "device": "${this.selectedNetworkDevice}",
                  "ipv4": {
                    "ipAddr": "${this.payloadForm.value['ipAddress']}",
                    "gateway": "${this.payloadForm.value['gateway']}",
                    "netmask": "${this.payloadForm.value['netmask']}"
                  }
                }
              ]
          }
      }
  }`;

    let centosPayloadMini = `
    {
      "options": {
          "defaults": {
              "version": "${this.payloadForm.value['version']}",
              "repo": "${this.payloadForm.value['repoUrl'] + '/' +
      this.payloadForm.value['osType'] + '/' +
      this.payloadForm.value['version'] + '/os/x86_64'}",
              "rootPassword": "${this.payloadForm.value['rootPassword']}",
              "installDisk": "${'/dev/' + this.payloadForm.value['installDisk']}"
          }
      }
  }`;
    return this.enableNetworkSetting ? centosPayload : centosPayloadMini;
  }

  createUbuntuPayload(): string {
    let ubuntuPayload = `
   {
    "options": {
        "defaults": {
            "version": "${this.payloadForm.value['version']}",
            "repo": "${this.payloadForm.value['repoUrl'] + '/ubuntu/16.04'}",
            "rootPassword": "${this.payloadForm.value['rootPassword']}",
            "baseUrl": "install/netboot/ubuntu-installer/amd64",
            "kargs": {
                "live-installer/net-image": 
                "${this.payloadForm.value['repoUrl'] + '/ubuntu/install/filesystem.squashfs'}"
            },
            "dnsServers": [
              "${this.payloadForm.value['dnsServers']}"
            ],
            "networkDevices": [
              {
                "device": "${this.selectedNetworkDevice}",
                "ipv4": {
                  "ipAddr": "${this.payloadForm.value['ipAddress']}",
                  "gateway": "${this.payloadForm.value['gateway']}",
                  "netmask": "${this.payloadForm.value['netmask']}"
                }
              }
            ],
            "installDisk": "${'/dev/' + this.payloadForm.value['installDisk']}"
        }
    }
}`;

    let ubuntuPayloadMini = `
   {
    "options": {
        "defaults": {
            "version": "${this.payloadForm.value['version']}",
            "repo": "${this.payloadForm.value['repoUrl'] + '/ubuntu/16.04'}",
            "rootPassword": "${this.payloadForm.value['rootPassword']}",
            "baseUrl": "install/netboot/ubuntu-installer/amd64",
            "kargs": {
                "live-installer/net-image": 
                "${this.payloadForm.value['repoUrl'] + '/ubuntu/install/filesystem.squashfs'}"
            },
            "installDisk": "${'/dev/' + this.payloadForm.value['installDisk']}"
        }
    }
}`;
    return this.enableNetworkSetting ? ubuntuPayload : ubuntuPayloadMini;
  }

  createEsxiPayload(): string {
    let vmnic = 'vmnic' + this.selectedNetworkDevice.substring(3);
    let esxiPayload = `{
      "options": {
        "defaults": {
          "version": "${this.payloadForm.value['version']}",
          "repo": "${this.payloadForm.value['repoUrl'] + '/' + this.payloadForm.value['osType'] +
      '/' + this.payloadForm.value['version']}",
          "rootPassword": "${this.payloadForm.value['rootPassword']}",
          "dnsServers": [
            "${this.payloadForm.value['dnsServers']}"
          ],
          "networkDevices": [
            {
              "device": "${vmnic}",
              "ipv4": {
                "ipAddr": "${this.payloadForm.value['ipAddress']}",
                "gateway": "${this.payloadForm.value['gateway']}",
                "netmask": "${this.payloadForm.value['netmask']}"
              }
            }
          ],
          "installDisk": "${this.payloadForm.value['installDisk']}"
        }
      }
    }`;

    let esxiPayloadMini = `{
      "options": {
        "defaults": {
          "version": "${this.payloadForm.value['version']}",
          "repo": "${this.payloadForm.value['repoUrl'] + '/' + this.payloadForm.value['osType']
      + '/' + this.payloadForm.value['version']}",
          "rootPassword": "${this.payloadForm.value['rootPassword']}",
          "installDisk": "${this.payloadForm.value['installDisk']}"
        }
      }
    }`;
    return this.enableNetworkSetting ? esxiPayload : esxiPayloadMini;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
