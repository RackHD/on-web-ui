import { Component, OnInit } from '@angular/core';
import { Catalog } from 'app/models';
import { CatalogsService } from 'app/services/rackhd/catalogs.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';
import { AlphabeticalComparator, ObjectFilterByKey, StringOperator } from 'app/utils/inventory-operator';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss']
})
export class CatalogsComponent implements OnInit {
  allCatalogs: Catalog[];
  catalogsStore: Catalog[];

  selectedCatalog: Catalog[];
  specCatalog: Catalog;
  isShowDetail: boolean;
  isShowData: boolean;

  // data grid helper
  searchTerms = new Subject<string>();
  dgDataLoading = false;

  constructor(public catalogsService: CatalogsService) {
    this.specCatalog = new Catalog();
  }

  public idComparator = new AlphabeticalComparator('id');
  public nodeComparator = new AlphabeticalComparator('node');
  public sourceComparator = new AlphabeticalComparator('source');
  public createTimeComparator = new AlphabeticalComparator('createdAt');
  public updateTimeComparator = new AlphabeticalComparator('updatedAt');

  public idFilter = new ObjectFilterByKey('id');
  public nodeFilter = new ObjectFilterByKey('node');
  public sourceFilter = new ObjectFilterByKey('source');

  ngOnInit() {
    this.getAllCatalogs();
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.searchNodes(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
  }

  getAllCatalogs(): void {
    this.catalogsService.getAll()
      .subscribe( data => {
        this.allCatalogs = data;
        this.catalogsStore = data;
        this.dgDataLoading = false;
      });
  }

  refreshDatagrid() {
    this.dgDataLoading = true;
    this.getAllCatalogs();
  }

  goToDetail(catalog: Catalog) {
    this.selectedCatalog = [catalog];
    this.isShowDetail = true;
  }

  goToShowData(catalog: Catalog) {
    this.specCatalog = catalog;
    this.isShowData = true;
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  searchNodes(term: string): void {
    const catalogs = _.cloneDeep(this.catalogsStore);
    this.dgDataLoading = true;
    this.allCatalogs = StringOperator.search(term, catalogs);
    this.dgDataLoading = false;
  }
}
