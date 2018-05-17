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
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class GridConfirmModalComponent {
  isPopValue: boolean = false;
  @Input() size: string = 'lg'; // Modal size
  @Input() title: string; // Modal key title
  @Input() data: any; // Data to be shown
  @Input() displayAttr: string = "id"; // Attribute of data to be shown
  @Input() action: string = "delete"; // Modal action 
  @Input() get isPop() { // Modal popup flag input
    return this.isPopValue;
  }
  @Output() isPopChange = new EventEmitter(); // Modal popup flag output
  @Output() confirm = new EventEmitter(); // Actions output

  set isPop(value) {
    this.isPopValue = value;
    this.isPopChange.emit(value)
  }

  constructor(){}

  onReject(){
    this.confirm.emit("reject");
  }

  onAccept(){
    this.confirm.emit("accept");
  }
}
