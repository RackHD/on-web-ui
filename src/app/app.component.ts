/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
// This Component is the top level component so import ClarityIcons here
// instead of import "../node_modules/clarity-icons/clarity-icons.min.js"
// in root module
import { ClarityIcons } from '@clr/icons';
import '@clr/icons/shapes/all-shapes';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  constructor( ) {
    // call ClarityIcons for once to include ClarityIcons js when packing.
    // in the future we will need to add customized icons
    // a service will be created for such needs and ClarityIcons will be called
    // in the service. Here will just be left a service calling.
    ClarityIcons.get();
  }

  public ngOnInit() {
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
