import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy,
  OnChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { StringOperator } from 'app/utils/inventory-operator';

import * as _ from 'lodash';

@Component({
  selector: 'dropdown-group',
  templateUrl: './dropdown-group.component.html',
  styleUrls: ['./dropdown-group.component.scss'],
})

export class DropdownGroupComponent implements OnInit, OnDestroy, OnChanges  {
  @Input() fields: string[] = []; // search field
  @Input() labels: string[]; // label for inputs
  @Input() widths: number[]; // input widths
  @Input() columns: number []; // dropdown grid size, follow bootstrap grid configures
  @Input() offsets: number [];
  @Input() size: number = 10; // dropdown size
  @Input() placeholders: string[]; // label for inputs
  @Input() disable: boolean [];
  @Input() isDefaultForm: boolean = false; // bootstrap/clarity default form format
  @Input() marginTop: string = '0px'; // margin top
  @Input() labelBold: boolean = true; // label bold
  @Input() fieldsRequired: boolean []; // label bold

  @Input() needSearchIcon: boolean = false; // search icon
  @Input() needReset: boolean = false; //reset button

  @Input() data: any[] = []; // all data for search

  @Output() selected = new EventEmitter(); // Single item is selected
  @Output() cleared: EventEmitter<string> = new EventEmitter(); // Ask for data reload

  searchTerms = new Subject<any>();
  searchSubscribe: any;
  allData: any [];

  dropdownLists: any = {};
  filterForm: FormGroup;

  classList: string [] = [];
  resetClass: string;

  isSelected: boolean = false;

  ngOnChanges() {
    switch(this.data.length) {
      case 0:
        if (this.filterForm) { this.reset(); }
        break;
      case 1:
        let formValues = _.pick(this.data[0], this.fields);
        this.filterForm.patchValue(formValues);
        this.selected.emit(this.data[0]);
        break;
      default:
        this.allData = _.map(this.data, (value, key) => {
          let _value = _.pick(value, this.fields);
          _value["index"] = key;
          return _value;
        });
        let filtered = this.filterByFormGroup(this.allData);
        this.getDropdownLists(filtered);
    }
  }

  ngOnInit() {
    let searchTrigger = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.search(term);
        return 'whatever';
      })
    );
    this.searchSubscribe = searchTrigger.subscribe();
    this.setDefaultParams();
    this.createFormGroup();
  }

  ngOnDestroy() {
    this.searchSubscribe.unsubscribe();
  }

  setDefaultParams() {
    let inputCount = this.fields.length;

    let columnSize = _.floor(12 / inputCount, 1);
    if(_.isEmpty(this.columns)) {
      this.columns = _.fill(Array(inputCount), columnSize);
    }
    if(_.isEmpty(this.offsets)) {
      this.offsets = _.fill(Array(inputCount), 0);
    }
    if(_.isEmpty(this.disable)) {
      this.disable = _.fill(Array(inputCount), false);
    }
    if(_.isEmpty(this.fieldsRequired)) {
      this.fieldsRequired = _.fill(Array(inputCount), false);
    }
    this.classList = _.map(this.offsets, (offset, key) => {
      return `col-lg-${this.columns[key]} col-lg-offset-${offset}`;
    });
    let buttonColumn = 12;
    buttonColumn = Math.abs(12 - _.sum(this.columns) - _.sum(this.offsets)) % 12;
    buttonColumn = buttonColumn ? buttonColumn : 12;
    this.resetClass = `col-lg-${buttonColumn}`;
  }

  createFormGroup(): void {
    this.filterForm = new FormGroup({});
    _.forEach(this.fields, (field, index) => {
      this.filterForm.addControl(field, new FormControl({value: '', disabled: this.disable[index]}))
    })
  }

  getDropdownLists(data): void {
    _.forEach(this.fields, field => {
      let list = _.map(data, field);
      list = _.uniq(list.sort());
      this.dropdownLists[field] = list.length > this.size ? _.slice(list, 0, this.size) : list;
    });
  }

  filterOnlySelected(term: string, field: string, dataStore: any): any[] {
    // Filter only selected item
    // StringOperator does match not exactly compare
    let matched = [];
    _.forEach(dataStore, data => {
      if(data[field] === term) {
        matched.push(data);
      }
    });
    return matched;
  }

  filterByFormGroup(allData) {
    if (!this.filterForm) return allData;
    let formValues = this.filterForm.value;
    let filtered = _.cloneDeep(allData);
    _.forEach(this.fields, (field) => {
      let term = formValues[field];
      if (term) {
        let excludeFields = _.remove(this.fields, field);
        filtered = StringOperator.search(term, filtered, excludeFields)
      }
    });
    return filtered;
  }

  search(input?: any): void {
    let filtered = this.filterByFormGroup(this.allData);
    if (this.isSelected && input.value) {
      filtered = this.filterOnlySelected(input.value, input.field, filtered);
      this.isSelected = false;
    }
    this.getDropdownLists(filtered);
    if (filtered.length === 1) {
      this.onSelected(filtered[0]);
    }
  }

  reset() {
    this.filterForm.reset();
    this.dropdownLists = [];
  }

  onSelected(sel: any){
    this.filterForm.patchValue(sel);
    this.selected.emit(this.data[sel.index]);
  }

  onSearch(term: string, field: string): void {
    this.searchTerms.next({
      field: field,
      value: term
    });
  }

  onChanged(): void {
    this.isSelected = true;
  }

  onClear(field: string) {
    this.filterForm.patchValue({[field]: ""});
    this.searchTerms.next({
      field: field,
      value: ""
    });
    this.cleared.emit(field);
  }

  onReset(field: string) {
    this.reset();
    this.cleared.emit("all");
  }
}
