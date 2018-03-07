import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Comparator, StringFilter } from "@clr/angular";
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { AlphabeticalComparator } from '../../utils/inventory-operator';
import * as _ from 'lodash';

import { TemplateService } from '../services/template.service';
import { Template, PAGE_SIZE_OPTIONS } from '../../models';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TemplatesComponent implements OnInit {
  templatesStore: Template[] = [];
  allTemplates: Template[] = [];
  isShowRawData: boolean;
  profileRawData: string;
  selectedProfile: string;

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = false;
  dgPlaceholder = 'No profile found!'
  selectedPageSize = "15";
  pageSizes = PAGE_SIZE_OPTIONS;

  public scopeComparator = new AlphabeticalComparator<Template>('scope');
  public nameComparator = new AlphabeticalComparator<Template>('name');

  get dgPageSize() {
    return parseInt(this.selectedPageSize);
  }

  constructor(private templateService: TemplateService) { }

  ngOnInit() {
    this.getAlltemplates();
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

  getAlltemplates(): void {
    this.templateService.getAll()
      .subscribe(data => {
        this.templatesStore = data;
        this.allTemplates = data;
        this.dgDataLoading = false;
      });
  }

  goToDetail(identifier: string) {
    this.selectedProfile = identifier;
    this.templateService.getByIdentifier(identifier, 'text')
    .subscribe(data => {
      this.profileRawData = data;
      this.isShowRawData = true;
    })
  }

  searchProfile(term: string){
    this.dgDataLoading = true;
    const templates = _.cloneDeep(this.allTemplates);
    function _contains(src: string): boolean {
      if (!src) {
        return false;
      }
      if (!term) {
        return true;
      }
      return src.toLowerCase().includes(term.toLowerCase());
    }
    this.templatesStore = _.filter(templates, (profile) => {
      return _contains(profile.name) || _contains(profile.scope);
    });
    this.dgDataLoading = false;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  refresh() {
    this.dgDataLoading = true;
    this.getAlltemplates();
  }

}
