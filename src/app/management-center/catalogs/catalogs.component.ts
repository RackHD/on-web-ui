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

  selectedCatalog: Catalog;
  specCatalog: Catalog;
  isShowDetail: boolean;
  isShowData: boolean;

  // data grid helper
  dgDataLoading = false;
  dgPlaceholder = 'No catalog found!'

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
  }

  getAllCatalogs(): void {
    this.catalogsService.getAll()
      .subscribe( data => {
        this.allCatalogs = data;
        this.catalogsStore = data;
        this.dgDataLoading = false;
      });
  }

  refresh() {
    this.dgDataLoading = true;
    this.getAllCatalogs();
  }

  goToDetail(catalog: Catalog) {
    this.selectedCatalog = catalog;
    this.isShowDetail = true;
  }

  onAction(action){
    switch(action) {
      case 'Refresh':
        this.refresh();
        break;
    };
  }

  onFilter(filtered){
    this.catalogsStore = filtered;
  }
}
