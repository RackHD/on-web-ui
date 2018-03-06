import { Component, OnInit, ViewChild } from '@angular/core';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';

@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.css']
})
export class JsonComponent implements OnInit {

  public editorOptions: JsonEditorOptions;
  public data: any;

  @ViewChild(JsonEditorComponent) editor: JsonEditorComponent;

  constructor() {
    this.editorOptions = new JsonEditorOptions();
  }

  ngOnInit() {

    this.data = {
      'randomNumber': 10,
      'products': [
        {
          'name': 'car',
          'product':
            [
              {
                'name': 'honda',
                'model': [
                  {'id': 'civic', 'name': 'civic'},
                  {'id': 'accord', 'name': 'accord'}, {'id': 'crv', 'name': 'crv'},
                  {'id': 'pilot', 'name': 'pilot'}, {'id': 'odyssey', 'name': 'odyssey'}
                ]
              }
            ]
        }
      ]
    }

  }

  initEditorOptions() {
    // this.editorOptions.mode = 'code'; //set only one mode
    this.editorOptions.modes = ['code', 'text', 'tree', 'view']; // set all allowed modes
  }

}
