import { Component, OnInit } from '@angular/core';
import { Poller, Node , POLLER_INTERVAL} from 'app/models';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlphabeticalComparator, DateComparator, ObjectFilterByKey, StringOperator, isJsonTextValid }
  from 'app/utils/inventory-operator';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { PollersService } from 'app/services/rackhd/pollers.service';
import { NodeService } from 'app/services/rackhd/node.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-pollers',
  templateUrl: './pollers.component.html',
  styleUrls: ['./pollers.component.scss']
})
export class PollersComponent implements OnInit {
  pollerInterval: number[] = POLLER_INTERVAL;

  pollerStore: Poller[];
  allPollers: Poller[] = [];

  selectedPoller: Poller;
  isShowDetail: boolean;

  isCreatePoller: boolean;
  isDelete: boolean;
  isUpdate: boolean;

  updatePoller: Poller;
  defaultInterval: number;
  defaultPaused: boolean;

  dgDataLoading = false;
  dgPlaceholder = 'No poller found!';
  jsonValid = true;

  allNodes: Node[];
  pollerForm: FormGroup;
  updateForm: FormGroup;

  selectedPollers: Poller[];

  isShowLatestData = false;
  currentPoller: any;
  currentLatestData = '';

  constructor(public pollersService: PollersService, public nodeService: NodeService,
    private fb: FormBuilder) {
  }

  public idComparator = new AlphabeticalComparator('id');
  public typeComparator = new AlphabeticalComparator('type');
  public configComparator = new AlphabeticalComparator('config');
  public pollIntervalComparator = new AlphabeticalComparator('pollInterval');
  public nodeComparator = new AlphabeticalComparator('node');
  public lastStartedComparator = new DateComparator('lastStarted');
  public lastFinishedComparator = new DateComparator('lastFinished');
  public pausedComparator = new AlphabeticalComparator('paused');
  public failureCountComparator = new AlphabeticalComparator('failureCount');

  public typeFilter = new ObjectFilterByKey('type');
  public nodeFilter = new ObjectFilterByKey('node');
  public configFilter = new ObjectFilterByKey('config');

  ngOnInit() {
    this.getAllPollers();
    this.getAllNodes();
    this.createForm();
    this.selectedPollers = [];
    this.defaultInterval = 60000;
  }

  onFilter(filtered: any[]): void {
    this.pollerStore = filtered;
  }

  onConfirm(value) {
    switch(value) {
      case 'reject':
        this.isDelete = false;
        break;
      case 'accept':
        this.isDelete = false;
        this.deleteSel();
    }
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Create':
        this.create();
        break;
      case 'Delete':
        this.batchDelete();
        break;
    };
  }

  getAllPollers(): void {
    this.pollersService.getAll()
    .subscribe(data => {
      if(_.isEmpty(data)) {
        this.dgDataLoading = false;
        this.allPollers = [];
        this.pollerStore = [];
        return null;
      }
      this.allPollers = data;
      this.pollerStore = data;
      for (let poller of data) {
        this.getLatestData(poller);
      }
    });
  }

  goToDetail(poller: Poller) {
    this.selectedPoller = poller;
    this.isShowDetail = true;
  }

  create(): void {
    this.isCreatePoller = true;
  }

  batchDelete(): void {
    if (!_.isEmpty(this.selectedPollers)) {
      this.isDelete = true;
    }
  }

  willDelete(poller: Poller){
    this.selectedPollers = [poller];
    this.isDelete = true;
  }

  willUpdate(poller: Poller): void {
    this.updatePoller = poller;
    this.defaultInterval = poller.pollInterval;
    if(!_.includes(this.pollerInterval, poller.pollInterval)){
      this.pollerInterval.push(poller.pollInterval);
      this.pollerInterval.sort();
    }
    this.defaultPaused = poller.paused;
    this.updateForm = this.fb.group({
      pollInterval: [this.defaultInterval, Validators.required],
      paused: [String(this.defaultPaused), Validators.required]
    });
    this.isUpdate = true;
  }

  update(): void {
    let jsonData = {};
    let value = this.updateForm.value;

    if (value['pollInterval'] !== this.defaultInterval) {
      jsonData['pollInterval'] = value['pollInterval'];
    }
    if (Boolean(value['paused']) !== this.defaultPaused) {
      jsonData['paused'] = !this.defaultPaused;
    }
    let postData = JSON.stringify(jsonData);
    this.pollersService.patchByIdentifier(this.updatePoller.id, postData)
    .subscribe(data => {
      this.refresh();
    });
  }

  getLatestData(poller: Poller): void {
    this.dgDataLoading = true;
    this.pollersService.getLatestData(poller.id)
    .subscribe(latestData => {
      poller['latestData'] = latestData;
      this.dgDataLoading = false;
    });
  }

  refresh() {
    this.dgDataLoading = true;
    this.getAllPollers();
  }

  getAllNodes(): void {
    this.nodeService.getAll()
      .subscribe(data => {
        this.allNodes = data;
      });
  }

  createForm() {
    this.pollerForm = this.fb.group({
      type: ['', Validators.required],
      node: ['', Validators.required],
      pollInterval: 60000,
      config: '',
    });

    this.updateForm = this.fb.group({
      pollInterval: ['', Validators.required],
      paused: ['', Validators.required]
    });
  }

  createPoller(): void {
    let jsonData = {};
    let value = this.pollerForm.value;

    this.jsonValid = isJsonTextValid(value.config);
    if (this.jsonValid) {
      // data transform
      jsonData['type'] = value['type'];
      jsonData['node'] = value['node'];
      jsonData['pollInterval'] = _.isEmpty(value.pollInterval) ? 60000 : parseInt(value.pollInterval);
      jsonData['config'] = _.isEmpty(value.config) ? {} : JSON.parse(value.config);

      this.isCreatePoller = false;
      this.pollersService.createPoller(jsonData)
        .subscribe(data => {
          this.refresh();
        });
    }
  }

  deleteSel(): void {
    let list = [];
    _.forEach(this.selectedPollers, poller => {
      list.push(poller.id);
    });

    this.pollersService.deleteByIdentifiers(list)
    .subscribe(results =>{
      this.refresh();
    });
  }

  showPollerLatestData(poller: Poller){
    this.isShowLatestData = true;
    this.currentPoller = poller;
    this.currentLatestData = poller.latestData || "There's no latest data."
  }
}
