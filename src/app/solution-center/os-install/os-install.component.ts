import { Component, OnInit } from '@angular/core';
import { Poller, Node, API_PATTERN, ADDR_PATTERN, REPO_PATTERN, IP_PATTERN, DNS_PATTERN } from 'app/models';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  AlphabeticalComparator,
  DateComparator,
  ObjectFilterByKey,
  StringOperator
} from 'app/utils/inventory-operator';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin'
import { of } from 'rxjs/observable/of'
import { map, catchError } from 'rxjs/operators';

import * as _ from 'lodash';
import { CatalogsService } from 'app/services/rackhd/catalogs.service';
import { NodeService } from 'app/services/rackhd/node.service';
import { PollersService } from 'app/services/pollers.service';
import { WorkflowService } from 'app/services/rackhd/workflow.service';
import { JSONEditor } from 'app/utils/json-editor';
import { ObmService } from 'app/services/rackhd/obm.service';
import { SkusService } from 'app/services/rackhd/sku.service';
import { TagService } from 'app/services/rackhd/tag.service';

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
  submitSuccess = false;
  confirmSubmited = false;
  enableNetworkSetting = false;

  searchTerms = new Subject<string>();

  selNodeStore: any[] = [];
  filterFields = ["type", "name", "sku", "id", "obms", 'tags'];
  filterLabels = ["Node Type", "Node Name", "SKU Name", "Node ID", "OBM Host", "Tag Name"];
  filterColumns = [4, 4, 4, 4, 4, 4];
  selectedNode: any;
  nodeStore: Array<any> = [];

  submitInfo = { status: "Are you sure to submit the workflow ?" };

  constructor(
    public nodeService: NodeService,
    public catalogsService: CatalogsService,
    public workflowService: WorkflowService,
    private obmService: ObmService,
    public skuService: SkusService,
    public tagService: TagService,
    private fb: FormBuilder,
  ) {
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
      '': 'Select OS TYPE first.',
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
    this.nodeService.getAll()
      .subscribe(data => {
        let computeNodes = _.filter(data, (item) => {
          return item.type === 'compute';
        });
        this.allNodes = computeNodes;
        this.dataStore = computeNodes;
        this.renderNodeInfo(computeNodes);
        for (let node of this.allNodes) {
          this.catalogsService.getSource(node.id, 'dmi')
          .subscribe(
            item => {
              let systemInfo = item['data']['System Information'];
              if (systemInfo) {
                node.manufacturer = systemInfo['Manufacturer'];
                node.model = systemInfo['Product Name'];
              }
            },
            err => {}
          );
        }
      });
  }

  createForm() {
    this.payloadForm = this.fb.group({
      osType: new FormControl('', { validators: [Validators.required] }),
      nodeId: new FormControl('', { validators: [Validators.required] }),
      workflowName: '',
      version: new FormControl('', { validators: [Validators.required] }),
      rootPassword: new FormControl('RackHDRocks', { validators: [Validators.required] }),
      dnsServers: new FormControl('', { validators: [Validators.pattern(DNS_PATTERN)] }),
      networkDevice: '',
      installDisk: '',
      ipAddress: new FormControl('', { validators: [Validators.pattern(IP_PATTERN), Validators.required] }),
      gateway: new FormControl('', { validators: [Validators.pattern(IP_PATTERN), Validators.required] }),
      netmask: new FormControl('', { validators: [Validators.pattern(IP_PATTERN), Validators.required] }),
      repoUrl: new FormControl('', { validators: [Validators.pattern(REPO_PATTERN), Validators.required] }),
      nodeModel: '',
      manufacturer: '',
      macName: ''
    });
  }

  onNodeChange(item) {
    this.search(item);
  }

  onNodeIdChange(item) {
    this.selectedNodeId = item;
    this.payloadForm.patchValue({ nodeId: item });
    this.getInstallDisk(this.selectedNodeId, 'driveId');
    this.getNetworkDevice(this.selectedNodeId, 'ohai');
  }

  onChangeOsType(item) {
    this.payloadForm.patchValue({ workflowName: this.OS_TYPE_NAME[item] });
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

  renderNodeInfo(nodes) {
    let list = _.map(nodes, node => {
      return forkJoin(
        this.getNodeSku(node).pipe(catchError( () => of(null))),
        this.getNodeObm(node).pipe(catchError( () => of(null))),
        this.getNodeTag(node).pipe(catchError( () => of(null)))
      ).pipe(
          map(results => {
            node["sku"] = results[0];
            node["obms"] = results[1];
            node["tags"] = results[2];
          })
      );
    });

    return forkJoin(list)
    .subscribe((data) => {
      this.allNodes = _.cloneDeep(nodes);
      this.nodeStore = _.cloneDeep(nodes);
      this.selNodeStore = _.cloneDeep(nodes);
    });
  }

  getNodeSku(node): Observable<string> {
    let hasSkuId = !!node.sku;
    let isComputeWithoutSku = (node.sku === null) && node.type === "compute";
    if (hasSkuId) {
      return this.skuService.getByIdentifier(node.sku.split("/").pop())
        .pipe( map(data => data.name) );
    } else if (isComputeWithoutSku) {
      return this.catalogsService.getSource(node.id, "ohai")
        .pipe(map(data => data.data.dmi.base_board.product_name));
    } else {
      return of(null);
    }
  }

  getNodeObm(node): Observable<string> {
    if (!_.isEmpty(node.obms)) {
      let obmId = node.obms[0].ref.split("/").pop();
      return this.obmService.getByIdentifier(obmId)
        .pipe( map(data => data.config.host) );
    } else {
      return of(null);
    }
  }

  getNodeTag(node): Observable<string> {
    if (!_.isEmpty(node.tags)) {
      return this.tagService.getTagByNodeId(node.id)
        .pipe(
          map(data => {
            if (_.isEmpty(data)) { return null; }
            return data.attributes.name;
          })
        );
    } else {
      return of(null);
    }
  }

  onFilterSelect(node) {
    this.selectedNode = node;
    if (!_.isEqual(this.selNodeStore, [node])) {
      setTimeout(() => {
        this.selNodeStore = [node];
      })
    }
  };

  onFilterRefresh() {
    this.selNodeStore = [];
    setTimeout(() => {
      this.nodeStore = _.cloneDeep(this.allNodes);
      this.selNodeStore = _.cloneDeep(this.allNodes);
    })
  }

  onReset() {
    this.selNodeStore = [];
    this.nodeStore = [];
    this.createForm();
    this.diskOptions = null;
    this.networkDeviceOptions = null;
    this.selectedRepoPlaceHolder = 'Select OS TYPE first.';
    this.modifyDefaultSetting = false;

    setTimeout(() => {
      this.nodeStore = _.cloneDeep(this.allNodes);
      this.selNodeStore = _.cloneDeep(this.allNodes);
    });
  }

  onNodeSelect(node) {
    this.selectedNode = node;
    if (!_.isEqual(this.nodeStore, [node])) {
      this.nodeStore = [node];
    }
    this.onNodeIdChange(node['id']);
  };

  onNodeRefresh() {
    this.nodeStore = [];
    setTimeout(() => {
      this.nodeStore = _.cloneDeep(this.allNodes);
    });
  }

  getInstallDisk(nodeId: string, source: string): void {
    this.catalogsService.getSource(nodeId, source)
    .subscribe(
      data => {
        this.diskOptions = new Array();
        let diskData = data['data'];
        for (let disk of diskData) {
          this.diskOptions.push(disk['devName']);
        }
        this.diskOptionsReady = true;
      },
      err => {}
    );
  }

  getNetworkDevice(nodeId: string, source: string): void {
    this.catalogsService.getSource(nodeId, source)
    .subscribe(
      iterm => {
        this.networkDeviceOptions = new Array();
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
      },
      err => {}
    );
  }

  createPayload() {
    this.payloadJson = this.createPayloadOptions();
    this.editor.set(this.payloadJson);
    this.enableOsinstall = true;
  }

  onSubmit() {
    this.confirmSubmited = false;
    let workflow = this.editor.get();
    this.payloadJson = workflow;
    this.workflowService.runWorkflow(
      this.selectedNodeId,
      this.OS_TYPE_NAME[this.payloadForm.value['osType']],
      this.payloadJson
    ).subscribe(
      data => { this.submitSuccess = true; },
      err => {
        this.submitSuccess = false;
        this.confirmSubmited = false;
      }
    );
  }

  onConfirmSubmited() {
    this.confirmSubmited = true;
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
    if (!_.isEmpty(this.payloadForm.value['installDisk'])) {
      if (this.payloadForm.value['osType'] === 'esxi') {
        installDisk = { 'installDisk': this.payloadForm.value['installDisk'] };
      } else {
        installDisk = { 'installDisk': "/dev/" + this.payloadForm.value['installDisk'] };
      }
    }

    _.assign(generalJson, version, repo, rootPassword, installDisk);

    if (this.enableNetworkSetting) {
      if (!_.isEmpty(this.payloadForm.value['dnsServers'])) {
        let dnsServers = { 'dnsServers': [this.payloadForm.value['dnsServers']] };
        _.assign(generalJson, dnsServers);
      }

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
    tmpJson = _.assign(tmpJson, { options: { 'defaults': generalJson } });
    return tmpJson;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  formClassInvalid(value: string): boolean {
    return this.payloadForm.get(value).invalid;
  }

  get enableSavePayload(){
    let majorEnable = (!this.formClassInvalid('nodeId')) &&
      (!this.formClassInvalid('repoUrl') && (!this.formClassInvalid('version'))) &&
      (!this.formClassInvalid('rootPassword'));
    let networkEnable = true;
    if (this.enableNetworkSetting) {
      networkEnable = (!this.formClassInvalid('ipAddress')) && (!this.formClassInvalid('netmask'))
        && (!this.formClassInvalid('gateway'));
    }
    return majorEnable && networkEnable;
  }
}
