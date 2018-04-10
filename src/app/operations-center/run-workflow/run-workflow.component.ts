import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-run-workflow',
  templateUrl: './run-workflow.component.html',
  styleUrls: ['./run-workflow.component.scss']
})
export class RunWorkflowComponent implements OnInit {
  injectableName: any;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    activatedRoute.queryParams.subscribe(queryParams => {
      this.injectableName = queryParams.injectableName;
      console.log(this.injectableName);
    });
  }

}
