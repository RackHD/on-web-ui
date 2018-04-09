import { Component, OnInit } from '@angular/core';
import { Poller, Node , POLLER_INTERVAL} from 'app/models';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlphabeticalComparator, DateComparator, ObjectFilterByKey, StringOperator }
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
    this.dgDataLoading = true;
    this.allPollers = StringOperator.search(term, this.dataStore);
    this.dgDataLoading = false;
  }

  getAllPollers(): void {
    this.allPollers = new Array();
    this.pollersService.getAll()
    .subscribe(data => {
      if(_.isEmpty(data)) {
        this.dgDataLoading = false;
        return null;
      }
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
      jsonData['pollInterval'] = value['pollInterval'];
    }
    if (value['paused'] !== this.defaultPaused) {
      jsonData['paused'] = !this.defaultPaused;
    }
    let postData = JSON.stringify(jsonData);
    this.pollersService.patchByIdentifier(this.updatePoller.id, postData)
    .subscribe(data => {
      this.refreshDatagrid();
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

  getAllNodes(): void {
    this.nodeService.getAll()
      .subscribe(data => {
        this.allNodes = data;
      });
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
    jsonData['pollInterval'] = _.isEmpty(value.pollInterval) ? 60000 : parseInt(value.pollInterval);
    jsonData['config'] = _.isEmpty(value.config) ? {} : JSON.parse(value.config);

    this.pollersService.createPoller(jsonData)
      .subscribe(data => {
        this.refreshDatagrid();
      });
  }

  delete(): void {
    let list = [];
    _.forEach(this.selectedPollers, poller => {
      list.push(poller.id);
    });

    this.pollersService.deleteByIdentifiers(list)
    .subscribe(results =>{
      this.refreshDatagrid();
    });
  }
}
