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
      //If we don't want to use hash mode, we need to change RackHD
      useHash: Boolean(history.pushState) === true,
      preloadingStrategy: PreloadAllModules
      // enableTracing: true
    })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
