import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup,FormControl }   from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import * as _ from 'lodash';

@Component({
  selector: 'search-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SearchDropDownComponent {
  @Input() label: string;
  @Input() size: number;
  @Input() width: number;
  @Input() data: string [];
  @Input() cleared: boolean = false;

  @Output() selected = new EventEmitter();

  searchTerms = new Subject<string>();
  searchField: string;

  onChange(input: string, inputKey: string){
    //onChange is triggered before keyup by enter
    this.isDropdownSelected = true;
  }

  onSearch(term: string, searchKey: string): void {
    this.searchField = searchKey;
    this.searchTerms.next(term);
  }

  searchWorkflow(term: string): void{
    let excludeFields = _.without(_.keys(this.allWorkflows[0]), this.searchField);
    this.workflowsStore = StringOperator.search(term, this.allWorkflows, excludeFields);
    if (this.isDropdownSelected) {
      this.onSelectSearch(term);
    }
    this.getDropdownOptions(this.workflowsStore);
  }

  onSelectSearch(term: string){
    this.isDropdownSelected = false;
    if (this.workflowsStore && this.workflowsStore.length === 1) {
      let url: string;
      this.selectedWorkflow = this.workflowsStore[0];
      this.graphId = this.selectedWorkflow.instanceId || this.selectedWorkflow.injectableName;
      this.updateCanvas();
      url =`/operationsCenter/workflowViewer?${this.isDefinition ? 'graphName': 'graphId'}=${this.graphId}`;
      this.gotoCanvas(url);
    } else {
      //Following search will be done among filtered workflows
      this.allWorkflows = _.cloneDeep(this.workflowsStore);
    }
  }
}
