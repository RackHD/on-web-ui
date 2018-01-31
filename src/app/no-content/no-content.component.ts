import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'no-content',
  template: `
    <div>
      <h1>404: page missing</h1>
    </div>
  `
})
export class NoContentComponent implements OnInit {
  public ngOnInit() {
    console.log('hello `404` component');
  }
}
