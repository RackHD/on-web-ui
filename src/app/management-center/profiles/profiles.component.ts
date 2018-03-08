import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AlphabeticalComparator, StringOperator, ObjectFilterByKey } from '../../utils/inventory-operator';
import * as _ from 'lodash';

import { ProfileService } from '../services/profile.service';
import { Profile, PAGE_SIZE_OPTIONS } from '../../models';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilesComponent implements OnInit {
  profilesStore: Profile[] = [];
  allProfiles: Profile[] = [];
  isShowRawData: boolean;
  profileRawData: string;
  selectedProfile: string;

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No profile found!'
  selectedPageSize = "15";
  pageSizes = PAGE_SIZE_OPTIONS;

  public scopeComparator = new AlphabeticalComparator<Profile>('scope');
  public nameComparator = new AlphabeticalComparator<Profile>('name');
  public scopeFilter = new ObjectFilterByKey<Profile>('scope');
  public nameFilter = new ObjectFilterByKey<Profile>('name');
  public idFilter = new ObjectFilterByKey<Profile>('id');

  get dgPageSize() {
    return parseInt(this.selectedPageSize);
  }

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getAllProfiles();
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchProfile(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
  }

  getAllProfiles(): void {
    this.profileService.getAll()
      .subscribe(data => {
        this.profilesStore = data;
        this.allProfiles = data;
        this.dgDataLoading = false;
      });
  }

  goToDetail(identifier: string) {
    this.selectedProfile = identifier;
    this.profileService.getByIdentifier(identifier, 'text')
    .subscribe(data => {
      this.profileRawData = data;
      this.isShowRawData = true;
    })
  }

  searchProfile(term: string){
    this.dgDataLoading = true;
    this.profilesStore = StringOperator.search(term, this.allProfiles, ["name", "scope"]);
    this.dgDataLoading = false;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  refresh() {
    this.dgDataLoading = true;
    this.getAllProfiles();
  }

}
