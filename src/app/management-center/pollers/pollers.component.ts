import { Component, OnInit } from '@angular/core';
import { Poller, Node } from 'app/models';
import { PollersService } from 'app/services/pollers.service';
import { NodeService } from 'app/services/node.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlphabeticalComparator, DateComparator, ObjectFilterByKey }
  from 'app/utils/inventory-operator';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

@Component({
  selector: 'app-pollers',
  templateUrl: './pollers.component.html',
  styleUrls: ['./pollers.component.scss']
})
export class PollersComponent implements OnInit {
  INTERVAL_MAP = new Map<string, number>();

  allPollers: Array<Poller>;
  dataStore: Poller[] = [];

  selectedPoller: Poller[];
  isShowDetail: boolean;

  isCreatePoller: boolean;
  isDelete: boolean;
  isUpdate: boolean;

  updatePoller: Poller;
  defaultInterval: number;
  defaultPaused: boolean;

  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No nodes found!';
  selectedPageSize = '15';

  allNodes: Node[];
  pollerForm: FormGroup;
  updateForm: FormGroup;

  selectedPollers: Poller[];

  constructor(public pollersService: PollersService, public nodeService: NodeService,
    private fb: FormBuilder) {
    this.INTERVAL_MAP.set('1 hour', 3600000);
    this.INTERVAL_MAP.set('3 hours', 10800000);
    this.INTERVAL_MAP.set('6 hours', 21600000);
    this.INTERVAL_MAP.set('24 hours', 86400000);
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
    const datas = _.cloneDeep(this.dataStore);
    function contains(src: string): boolean {
      if (!src) {
        return false;
      }
      if (!term) {
        return true;
      }
      return src.toLowerCase().includes(term.toLowerCase());
    }
    this.dgDataLoading = true;
    this.allPollers = _.filter(datas, (data) => {
      return contains(data.id) || contains(data.node) ||
        contains(data.type) || contains(JSON.stringify(data.config));
    });
    this.dgDataLoading = false;
  }

  getAllPollers(): void {
    this.allPollers = new Array();
    this.pollersService.getAllPollers()
      .subscribe(data => {
        this.dataStore = data;
        for (let poller of data) {
          this.getLatestData(poller);
        }
      });
  }

  goToDetail(poller: Poller) {
    this.selectedPoller = [poller];
    this.isShowDetail = true;
  }

  get dgPageSize() {
    return +this.selectedPageSize;
  }

  willCreatePoller(): void {
    this.isCreatePoller = true;
  }

  willDelete(poller?: Poller): void {
    if (poller) {
      this.selectedPollers = [poller];
    }
    this.isDelete = true;
  }

  willUpdate(poller: Poller): void {
    this.updatePoller = poller;
    this.defaultInterval = poller.pollInterval;
    this.defaultPaused = poller.paused;
    this.updateForm = this.fb.group({
      pollInterval: this.defaultInterval,
      paused: this.defaultPaused,
    });
    this.isUpdate = true;
  }

  update(): void {
    let jsonData = {};
    let value = this.updateForm.value;

    if (value['pollInterval'] !== this.defaultInterval) {
      jsonData['pollInterval'] = this.INTERVAL_MAP.get(value['pollInterval']);
    }
    if (value['paused'] !== this.defaultPaused) {
      jsonData['paused'] = !this.defaultPaused;
    }
    let postData = JSON.stringify(jsonData);
    this.pollersService.patchData(this.updatePoller.id, postData).subscribe(data => {
      this.refreshDatagrid();
    });
  }

  getAllNodes(): void {
    this.nodeService.getAllNodes()
      .subscribe(data => {
        this.allNodes = data;
      });
  }

  getLatestData(poller: Poller): void {
    this.dgDataLoading = true;
    this.pollersService.getLatestData(poller.id)
      .subscribe(latestData => {
        poller['latestData'] = latestData;
        this.allPollers.push(poller);
        this.dgDataLoading = false;
      });
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  refreshDatagrid() {
    this.dgDataLoading = true;
    this.getAllPollers();
  }

  createForm() {
    this.pollerForm = this.fb.group({
      type: '',
      node: '',
      pollInterval: '',
      config: '',
    });

    this.updateForm = this.fb.group({
      pollInterval: '',
      paused: '',
    });
  }

  createPoller(): void {
    let jsonData = {};
    let value = this.pollerForm.value;

    // data transform
    jsonData['type'] = value['type'];
    jsonData['node'] = value['node'];
    jsonData['pollInterval'] = this.INTERVAL_MAP.get(value.pollInterval);
    jsonData['config'] = value.config ? JSON.parse(value.config) : {};

    let postData = JSON.stringify(jsonData);
    this.pollersService.creatOnePoller(postData)
      .subscribe(data => {
        this.refreshDatagrid();
      });
  }

  delete(): void {
    let res = this.pollersService.deletePollers(this.selectedPollers);
    for (let entry of res) {
      entry.subscribe(() => {
        this.refreshDatagrid();
      });
    }
  }
}
