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
  selector: 'details-modal',
  templateUrl: './details-modal.component.html',
  styleUrls: ['./details-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GridDetailsModalComponent {
  isPopValue: boolean = false;
  @Input() isJson: boolean = true;
  @Input() size: string = 'lg';
  @Input() title: string;
  @Input() data: any;
  @Input() dataType: string = "Details";
  @Input() get isPop() {
    return this.isPopValue;
  }
  @Output() isPopChange = new EventEmitter();

  set isPop(value) {
    this.isPopValue = value;
    this.isPopChange.emit(value)
  }

  constructor(){}

}
