import {
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AlphabeticalComparator, StringOperator, ObjectFilterByKey } from '../../utils/inventory-operator';
import { Observable } from 'rxjs/Observable';

import * as _ from 'lodash';

import { PAGE_SIZE_OPTIONS } from 'app/models';

@Component({
  selector: 'inventory-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InventoryHeaderComponent implements OnInit {
  @Input() allItems: any;
  @Input() name: string;
  @Input() isSearchRequired: boolean = true;
  @Input() isRefreshRequired: boolean = true;
  @Input() isDeleteRequired: boolean = true;
  @Input() isCreateRequired: boolean = true;
  @Input() isCancelRequired: boolean = false;

  @Output() filter = new EventEmitter();
  @Output() action = new EventEmitter();

  filteredItems: any[];
  searchTerms = new Subject<string>();

  constructor(){}

  ngOnInit() {
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.search(term);
        return 'whatever';
      })
    );
    searchTrigger.subscribe();
  }

  search(term: string){
    this.filteredItems = StringOperator.search(term, this.allItems);
    this.filter.emit(this.filteredItems);
  }

  onSearch(term){
    this.searchTerms.next(term);
  }

  onCreate(){
    this.action.emit("Create");
  }

  onRefresh(){
    this.action.emit("Refresh");
  }

  onBatchDelete(){
    this.action.emit("Delete");
  }

  onBatchCancel(){
    this.action.emit("Cancel")
  }
}
