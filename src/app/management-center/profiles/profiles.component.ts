import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AlphabeticalComparator, StringOperator, ObjectFilterByKey } from 'app/utils/inventory-operator';
import * as _ from 'lodash';

import { ProfileService } from 'app/management-center/services/profile.service';
import { Profile, ModalTypes } from 'app/models';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfilesComponent implements OnInit {
  profilesStore: Profile[] = [];
  allProfiles: Profile[] = [];
  selectedProfile: Profile;

  files: FileList;

  action: string;
  isShowModal: boolean;
  rawData: string;

  modalTypes: ModalTypes;

  // data grid helper
  dgDataLoading = false;
  dgPlaceholder = 'No profile found!'

  public scopeComparator = new AlphabeticalComparator<Profile>('scope');
  public nameComparator = new AlphabeticalComparator<Profile>('name');
  public scopeFilter = new ObjectFilterByKey<Profile>('scope');
  public nameFilter = new ObjectFilterByKey<Profile>('name');
  public idFilter = new ObjectFilterByKey<Profile>('id');

  constructor(private profileService: ProfileService) { }

  ngOnInit() {
    this.getAll();
    this.modalTypes = new ModalTypes();
  }

  getAll(): void {
    this.profileService.getAll()
      .subscribe(data => {
        this.profilesStore = data;
        this.allProfiles = data;
        this.dgDataLoading = false;
      });
  }

  getMetaData(identifier: string) {
    this.profileService.getMetaByIdentifier(identifier)
    .subscribe(data => {
      this.rawData = data;
      this.isShowModal = true;
    })
  }

  getRawData(identifier: string) {
    this.profileService.getByIdentifier(identifier, 'text')
    .subscribe(data => {
      this.rawData = data;
      this.isShowModal = true;
    })
  }

  onFilter(filtered){
    this.profilesStore = filtered;
  }

  refresh() {
    this.dgDataLoading = true;
    this.getAll();
  }

  create(){
    this.action = "Upload";
    this.isShowModal = true;
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
      case 'Create':
        this.create();
        break;
    };
  }

  onUpdate(profile: Profile){
    this.selectedProfile = profile;
    this.action = "Update";
    this.isShowModal = true;
  }

  onGetDetails(profile: Profile) {
    this.selectedProfile = profile;
    this.action = "Meta";
    this.getMetaData(profile.name);
  };

  onGetRawData(profile: Profile) {
    this.selectedProfile = profile;
    this.action = "Raw"
    this.getRawData(profile.name);
  };

  onChange(event){
    this.files =  event.target.files;
  }

  onCreateSubmit(){
    //existingFilename is used to store filename when updating file
    let existingFilename = this.selectedProfile && this.selectedProfile.name;
    let file = this.files[0];
    //TODO: Add more details on progress
    //TODO: And use sync mode instead of async mode
    //TODO: Add support on multiple files upload support
    this.isShowModal = false;
    this.profileService.upload(file, existingFilename || file.name)
    .subscribe(() => {
      this.selectedProfile = null;
      this.refresh();
    })
  }

}
