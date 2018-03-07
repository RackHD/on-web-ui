import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { ProfileService } from '../../services/profile.service';
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

  public scopeComparator = new AlphabeticalComparator('scope');
  public nameComparator = new AlphabeticalComparator('name');

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
    const profiles = _.cloneDeep(this.allProfiles);
    function _contains(src: string): boolean {
      if (!src) {
        return false;
      }
      if (!term) {
        return true;
      }
      return src.toLowerCase().includes(term.toLowerCase());
    }
    this.profilesStore = _.filter(profiles, (profile) => {
      return _contains(profile.name) || _contains(profile.scope);
    });
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

class AlphabeticalComparator implements Comparator<Profile> {
  sortBy: string;

  constructor(sortBy: string) {
    this.sortBy = sortBy;
  }

  compare(a: Profile, b: Profile) {
    let sortedArray = _.sortBy([a, b], [o => o[this.sortBy]]);
    return _.findIndex(sortedArray, a) - _.findIndex(sortedArray, b);
  }
}

