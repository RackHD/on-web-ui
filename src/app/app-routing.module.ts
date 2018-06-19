import { NgModule }             from '@angular/core';
import {
  RouterModule,
  PreloadAllModules
} from '@angular/router';

// import routing table
import { ROUTES } from './app.routes';

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      useHash: Boolean(history.pushState) === false,
      preloadingStrategy: PreloadAllModules
      // enableTracing: true
    })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
