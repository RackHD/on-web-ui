import { ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';

import * as _ from 'lodash';

import { PAGE_SIZE_OPTIONS } from 'app/models';

@Component({
  selector: 'inventory-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class InventoryFooterComponent {

  selectedPageSize = "15";

  get pageSizes() {
    return PAGE_SIZE_OPTIONS
  };

  get dgPageSize() {
    return parseInt(this.selectedPageSize);
  }

  constructor(){}
}
