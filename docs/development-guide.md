# Table of Content
  * [Basic Notes](development-guide.md#basic-notes)
    * [AoT Don'ts](development-guide.md#aot-donts)
    * [TypeScript](development-guide.md#typescript)
    * [Types](development-guide.md#types)
    * [File Structure](development-guide.md#file-structure)
  * [Coding convention](development-guide.md#coding-convention-and-best-practice)
    * [External Stylesheets](development-guide.md#external-stylesheets)
    * [Lazy loading](development-guide.md#lazy-loading)
    * [Write CSS](development-guide.md#write-css)
    * [Draw chart](development-guide.md#draw-chart)
    * [Jumping between Pages] (development-guide.md#jumping-between-pages)
    * [Unit test](development-guide.md#unit-test)
    * [Data Service](development-guide.md#data-service)

# Basic Notes

## AoT Don'ts
The following are some things that will make AoT compile fail.

- Don't use require statements for your templates or styles, use styleUrls and templateUrls, the angular2-template-loader plugin will change it to require at build time.
- Don't use default exports.
- Don't use `form.controls.controlName`, use `form.get('controlName')`
- Don't use `control.errors?.someError`, use `control.hasError('someError')`
- Don't use functions in your providers, routes or declarations, export a function and then reference that function name
- @Inputs, @Outputs, View or Content Child(ren), Hostbindings, and any field you use from the template or annotate for Angular should be public


## TypeScript
> To take full advantage of TypeScript with autocomplete you would have to install it globally and use an editor with the correct TypeScript plugins.

### Use latest TypeScript compiler
TypeScript 2.1.x includes everything you need. Make sure to upgrade, even if you installed TypeScript previously.

```
npm install --global typescript
```

### Use a TypeScript-aware editor
We have good experience using these editors:

* [Visual Studio Code](https://code.visualstudio.com/)
* [Webstorm 10](https://www.jetbrains.com/webstorm/download/)
* [Atom](https://atom.io/) with [TypeScript plugin](https://atom.io/packages/atom-typescript)
* [Sublime Text](http://www.sublimetext.com/3) with [Typescript-Sublime-Plugin](https://github.com/Microsoft/Typescript-Sublime-plugin#installation)

#### Visual Studio Code + Debugger for Chrome
> Install [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) and see docs for instructions to launch Chrome

The included `.vscode` automatically connects to the webpack development server on port `3000`.

## Types
> When you include a module that doesn't include Type Definitions inside of the module you can include external Type Definitions with @types

i.e, to have youtube api support, run this command in terminal:
```shell
npm i @types/youtube @types/gapi @types/gapi.youtube
```
In some cases where your code editor doesn't support Typescript 2 yet or these types weren't listed in ```tsconfig.json```, add these to **"src/custom-typings.d.ts"** to make peace with the compile check:
```es6
import '@types/gapi.youtube';
import '@types/gapi';
import '@types/youtube';
```

### Custom Type Definitions
When including 3rd party modules you also need to include the type definition for the module
if they don't provide one within the module. You can try to install it with @types

```
npm install @types/node
npm install @types/lodash
```

If you can't find the type definition in the registry we can make an ambient definition in
this file for now. For example

```typescript
declare module "my-module" {
  export function doesSomething(value: string): string;
}
```


If you're prototyping and you will fix the types later you can also declare it as type any

```typescript
declare var assert: any;
declare var _: any;
declare var $: any;
```

If you're importing a module that uses Node.js modules which are CommonJS you need to import as

```typescript
import * as _ from 'lodash';
```

## File Structure
```
ui/
 ...config/                        * the configuration
 |   ...helpers.js                 * helper functions for the configuration files
 |   ...spec-bundle.js             * ignore this magic that sets up the Angular testing environment
 |   ...karma.conf.js              * karma config for the unit tests
 |   ...protractor.conf.js         * protractor config for the end-to-end tests
 .   ...webpack.dev.js             * the development webpack config
 .   ...webpack.prod.js            * the production webpack config
 .   ...webpack.test.js            * the testing webpack config
 .
 ...src/                           * the source files that will be compiled to javascript
 |   ...main.browser.ts            * the entry file for the browser environment
 .   .
 |   ...index.html                 * Index.html: where we generate the index page
 .   .
 |   ...polyfills.ts               * the polyfills file
 .   .
 .   ...app/                       * WebApp: folder
 .   .   ... ...                   * All angular source code of the project.
 .   .
 .   ...assets/                    * static assets are served here
 .       ... ...                   * for humans to know who the developers are
 .
 .
 ...tslint.json                    * typescript lint config
 ...typedoc.json                   * typescript documentation generator
 ...tsconfig.json                  * typescript config used outside webpack
 ...tsconfig.webpack.json          * config that webpack uses for typescript
 ...package.json                   * what npm uses to manage its dependencies
 ...webpack.config.js              * webpack main configuration file

```
More Details of **app folder**
```
app
... charts                         * Share module of chart drawing
... core                           * Core module of injecting global service
.   ... testing                    * Mock service for unit testing
... home                           * Feature module: home
.   ... ...                        * Child components of feature module
... inventory                      * Feature module: inventory
... login                          * Feature module: login
... models                         * Global or share data models
... no-content                     * Feature component: 404 page
... node                           * Feature module: node
... signup
... user-profile
```

# Coding Convention and Best Practice

### External Stylesheets
Any stylesheets (Sass or CSS) placed in the `src/styles` directory and imported into your project will automatically be compiled into an external `.css` and embedded in your production builds.

For example to use Bootstrap as an external stylesheet:
1) Create a `styles.scss` file (name doesn't matter) in the `src/styles` directory.
2) `npm install` the version of Boostrap you want.
3) In `styles.scss` add `@import 'bootstrap/scss/bootstrap.scss';`
4) In `src/app/app.module.ts` add underneath the other import statements: `import '../styles/styles.scss';`


## Lazy loading

When there's a requirement of new feature development, create component for this feature is a standard way in Angular, then this feature component should be put into one of current feature modules. However if there's no
proper module for it, a new feature module must be created.

When create feature module, ```lazy loading module``` is highly recommended. A lazy loaded module won't occupy any resource when app start to serve, unless it is visited.

How to create a lazy loading module:
1. Create a module as usual, but don't import it in any place.

2. Add routes in global route table, for example
```
// app.routes.ts
{ path: 'lazy-loading', loadChildren: 'app/lazy-loading/lazy-loading.module#LLModule'},
```
  then the router knows how to route to this module without any module import.

3. Which component will be loaded when routing to the lazy loading module? Default routes should be added into the lazy module routes to point out default component.
```
// lazy-module.routes.ts
{  path: '',  component: LazyLoadingDefaultComponent }
```

Component can also be lazily loaded, using route to access component : ```{  path: '',  component: LazyLoadDefaultComponent }``` will make it be lazily loaded, and use component selector directly will load the component immediately when app starts to serve.

## Write CSS

Angular component gives developers great convenience to write CSS, by default the CSS files of each component is totally independent.

CSS convention:

1.  Highly recommended to use [sass](http://sass-lang.com/), more readable and powerful.

2.  Define hierarchical classes for html DOM and use classes to define html styles:
    ```
     // .html
    <div class="mainClass">
          <div class="subClass1">
          <div class="subClass2">
          ......

     // .scss
    .mainClass {
          ...styles
          .subClass1{
            ...styles
          }
          .subClass2{
            ...styles
          }
    }
    ```
3.  Reduce the use of html tags for defining styles, use CSS class instead. If must use it please define CSS class to wrap it:  ```.myClass div {...styles}```.
CSS class is more readable and it won't be changed frequently.
But html tags may change normally, then the CSS must be modified too if don't obey this term of rule.

4.  Please do not use **common css classes of framework** directly, unless want to change global css styles in global app.scss.
For example, do **not** write css like this:
    ```
    // row and col-lg-x are all common css classes of framework
     .row {
          ...styles
    }

     .col-lg-2 {
          ...styles
    }
    ```
    Subsequent developers or maintainers may also use these classes in the same component. These usage may cause problems for them.

    Recommended usage:
    ```
    HTML:
    <div col-lg-2  class="my-col">.....
    SCSS:
    .my-col {
        ....styles
    }
    ```

### Responsive Page

1. For responsive page, when need to define ```height``` please use ```min-height``` instead, otherwise in small screen the content may overflow the fixed height.

2. Bootstrap grid(column)

    1. When use column to devided texts, please allocate enough columns to the text which length is relatively fixed.
    2. Always define all ```col-xl/lg/md/xm/xs``` for html doms which use bootstrap columns.
    3. Clarity just support part of bootstrap grid, for example, if want to use ```hidden-sm```, please use ```@media {max-width: xxx}``` instead. specific width of ```xl/lg/md/xm/xs``` can be found in bootstrap documents.

## Draw chart

Main purpose of this UI project is to display data for MARS project. So chart drawing is an essential part, and for flexibility, [D3](https://d3js.org/) is chosen to do this job.

D3 is flexible but writing d3 code is totally different with developing Angular4 component, besides, raw d3 code is hard to understand. For usability and readability, **abstract common charts into Angular component is highly recommended**.

In ```src/app/charts``` two kinds of chart has been packaged into Angular component as sample code.

Usage:
1. Chart components are declared in ```chart.module```, so whenever want to draw these two charts, import ```ChartModule``` first(for unlazy module, just import it once in root module).

2. Use component selector to load chart, passing parameters according to its ```@Input``` list:
  ```
  <app-chart-donut
    [donutWidth]="myWidth"
    ......
    [donutThick]=6
    ......>
  </app-chart-donut>
  ```

## Jumping between Pages

It's a typical mistake to use `<a href="home">Go Home </a>` to jump from an application page to another.
It's absolute right in web page design or go to an external link, but in Angular application, it will cause the application reload (all module/component being constructed again), which sometimes is not expected.

There are two ways:

(1) use `routerLink`  like this example:  ` <a routerLink="/home">Text</a>`. it will leverage Angular Router to do the page redirection without reload the whole application.
(2)  use code :
* import `Router` and add it into your component's constructor `constructor( public router: Router,  ....)`
* add an event to your button or link :  `<button  (click)="GotoXXX()">yyyy</button>`
* create the function :
```
public goToXXX(){    this.router.navigate( ['abcdefg'] );       }
```

Tips:
*  when if there are both `href` and (click) event for a `<a>` (ex: <a href='home' (click)='Foo()'></a>) . The `href` will take priority, so avoid this confusing coding.
* IF it's to redirect to a relative page ( example, to jump from `$URL/inventory` to `$URL/inventory/id=4`),  use `ActivatedRoute`:
  add `public activatedRoute: ActivatedRoute,` into component constructor, and use code as below
  `    this.router.navigate( ['yourRelativePath'], {relativeTo: this.activatedRoute});   `





## Unit test

Component and service are the most two common concepts for Angular developers, and each of them has many sub-types.
For example, there's usual services relates to one or more components, but also interceptors, resolvers and route guard service etc. for app-wide scope.
Some components contain ```<router-outlets>``` or ```router-link``` but the others don't.
The hardest part is that the test methods of each kind of components or services are different.

Recommend to read [official document](https://v4.angular.io/guide/testing) first.

### Some basic rules
1.  Use nested ```describe``` to clear the structure of test cases.
    ```
    describe('MyComponent/MyService', ()=>{
        describe('In default situation' ()=>{
            ......
        })
        describe('After modal shows' ()=>{
            ......
        })
    })
    ```
    This format can bring great readability and maintainability for test cases.

2.  Every **complicated** service should have a corresponding mockService for testing.
```src/app/core/testing``` is the folder for saving mock version of global services under ```app/core``` .

  * Q: Why need to do this?
  * A: Services may be imported by each other, a component may also imports one or more services.
  When doing unit test a testbed must be setup for UUT(Unit under test),
  so the services which a UUT needs must be put into provider of its testbed. Imagine
  that the services also need other services, so other services must be put into providers too.
  Same thing will happen again in the "other service", then finally the whole project is imported just for testing this UUT. This is unacceptable. A mockService can solve this terrible problem, with it
  importing any other services becomes unnecessary. Just import the mock one and then spyOn the methods according to the original service.

3.  For keeping independence of test cases, spyOn all external method which is not defined in the UUT.

### Test component
```src/app/login/login.component.spec.ts``` is an example, it contains all
necessary parts for testing usual component and also a clear structure.
1.  Import:
  * Import necessary Angular modules for initializing component.
  * Import self-defined mock services, stubs or helpers for creating testbed.
  * Import helper methods provided by Angular for unit test.
2.  Define:
  * Define const fake data for testing.
  * Define global variables.
  * Define helper classes and methods, ```createComponent()``` method encapsulates
  the init steps of testbed and component, class ```Page``` abstracts all the html
  elements into variables, it can bring great convenience for writing test cases.
3.  Use nested describe structure as basic rules 1.

###  Test service
Testing service is much more easier than component, usually a service can be regard
as a normal class, it can be tested without any knowledge of Angular.

Tips for testing specific services:
1.  Route guard service
  * createSpyObj of ```RouterStateSnapshot```.
  * Use ```new ActivatedRouteSnapshot()``` to represent route.
2.  Http interceptor service
  * ```import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';```.
  * Get ```HttpTestingController``` service instance from testbed, use this instance to inspect http request/response.


## Data Service

*This session acts as a reference code for writing  `service` code*

### Why Service
Sometimes, it's not good idea to write the view layer code(typically component.ts) with the data acquisition business. Layered-code is a common sense of programing.
So Angular suggests to separate data acquisition business to a single service that provides the data and share that service with all components that need the data.

### Service Code Convention
* The file should be named xxxx.service.ts
* If a service will ONLY be used for a specific component, it's ok to put the service code together with the component code in the feature folder( example: put `login.service.ts` with `login.component.ts` in `login` folder)
* If a service will be shared by multiple components, it's suggested to move the xxx.serivce.ts file to `src/app/services` folder.
* If this service should be a **singleton** ( single instance across this application, instead of multiple instances for multiple components which consume this service), which typically the service maintains some global state or cache..etc; then don't put the service in each component's `provider[]` in their `module.ts` code, instead , leveraging the  `SharedServicesModule`( in `src/app/services/sharedServices.module.ts`), acts as a unique injector pool. (refer to [//https://github.com/angular/angular/issues/12889] for more detail )


### Data Auto-fresh
On the other hand, the MARS frontends are not static. Most of MARS backend data tend to be changed during system running, example: the system utilization varies from time to time, the events keeps growing.
So it's required to refresh the data.
There're 2 options to refresh the web view to reflect the latest backend data:
   * (1)    Manual refresh ( refresh the whole page or providing a refresh button to refresh part of the page)
   * (2)    Auto-refresh

To write data-service to meet the need of (2) Auto-Refresh, below practices are for your reference.

1. Injectable Data Service
To separate the view and data layer, it's typically recommended to using a injectable service class to fetch the backend data instead of doing this inside the component code.
Typically, the service class can be implement as below.,

```
import {Injectable} from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';  // for Observer.timer
import { switchMap } from 'rxjs/operators';

@Injectable()                        //  the data service is an injectable class
export class MyService
{
    obs: Observable <any>;

    constructor(private http: HttpClient){
        let t = Observable.timer(0,2000);   // starting in 0 ms, and later repeat every 2000 ms
        this.obs = t.pipe( switchMap( (t) => { return this.http.get(URL);} ) );
}

    public  get(): Observable<any>  { return this.obs; };
}
```

Here's the detail explanation:
```
        let tm = Observable.timer(0,2000);   
```

Creating a Timer ( as a observable), it will emit data 0 at the starting time( first parameter, here is 0 , means emit data right away. So we can fetch data right way when page is opened  ), and emit data every 2000 ms .
```
           this.obs = tm.pipe( switchMap( () => {  return this.http.get(URL); }  )    );
```
http.get(URL):   using Angular HttpClient to fetch data from backend API, it will return a Observable.
swithMap():  it's to re-shape an Observable flow to another Observable. Here , it will convert the Timer(tm) to http.get(). Aka, whenever Timer emits anything, the `http.get()` will be invoked  , and this become a new Observable flow.
.pipe():  in new Angular4/5, the RxJS operator has to be wrapped inside a `.pipe()`

This Observable won't emit anything until it's being subscribed by component code, so don't worry about wasting resources before it's needed.


2. The View Component
First of all, the HTML can use `<h2>{{ var }}</h2>` to realtime reflect the change of the `this.var` value defined in component.ts code.
Below are the reference code of how to interact with the service .
```
import { Component, OnInit , OnDestroy  } from '@angular/core';
import { MyService } from '../service';

export class MyComponent implements OnInit ,OnDestroy{
    private subscription: any;
    constructor( private myService: MyService ){};
    ngOnInit(): void {
        this.subscription = this.myService.get().subscribe(
            data => {          this.var = data.x.y.z;     /* use the data from http response*/       });
    }

    ngOnDestroy(): void{
        this.subscription.unsubscribe();  // Don't forget the unsubscribe()

    }
```


**Q**: Why all of my `subscribe` of `http.get()` suffer from **404** http error ?
**A**: It's possible that your http request has been hijacked by `InMemoryWebApiModule`.
Use below code in your root `NgModule`'s `imports[]`:
```
InMemoryWebApiModule.forRoot(InMemoryDataService,{ passThruUnknownUrl: true })
```


**Q**: why should we do `this.subscription.unsubscribe();`?

**A**: otherwise, when this component being destroyed, like redirecting to some other page, the service will still keep running to poll the backend http API , wasting system resources.
Note, in above service implementation, after `unsubscribe()`, the `this.obs` ( which invokes `http.get`) will stop flowing, but the Observable.timer() is still running(which is not a big overhead).

**Q**: can multiple component subscribe to the same service ?

**A**: Yes. In that case, each of the observer( who subscribes the service) will have a separated repeatable flow to talk with backend http API.


**Advanced part of service**

**Q**: What if the multiple Observers (who subscribe the same service ) will finally require the same HTTP API ?

**A**: If that case ,  those HTTP API call will be  duplicated for above code.    But we provide another code below for your reference, to implement a way for multiple Observers and same http request.

```
// usage
//let subscription = myService.dataStream.subscribe(data => {}, err => {})
//subscription.unsubscribe();
@Injectable()
export class MyService
{
    sub = new BehaviorSubject<any>(0);
    dataStream: Observable<any>;
    timer_subscription : any;
    cnt : number = 0;
    timer = Observable.timer(0,1000);
    startPolling(){
        this.timer_subscription = this.timer.subscribe(
            (t) => {  this.http.get(URL).subscribe(data =>  { this.sub.next(data); });        });
    }
    constructor(private http: HttpClient){
        this.dataStream = Observable.create(
            observer => {
                if(this.cnt ==0 ) {   this.startPolling(); }
                this.cnt +=1;
                let subscription = this.sub.subscribe(d => { observer.next(d); } );
                observer.add( ()=>{     //Adds a tear down to be called during the unsubscribe() of this Subscription.
                    subscription.unsubscribe();
                    this.cnt -=1;
                    if (this.cnt ==0) {this.timer_subscription.unsubscribe();}
                }); // end of observer.add(
            }
        ); // end of Observable.create(
    }
}

```
Below are the simple diagram of different streams in above code.
the `dataStream` is a reference guard to ensure no http-call until service being subscribed , and no more http call when all observers have un-subscribed.
the `this.sub` is typed as `Subject` or `BehaviorSubject`, because it will act as both `Observer` and `Observable`.

![illustration of above code](https://media.eos2git.cec.lab.emc.com/user/20/files/d800b578-eb2e-11e7-96fc-494b54563e65)





Last,
below are **Summary** of the coding notes which you need to pay attention when writting a `service` code:
*   Be able to allow multiple subscription to the same service
*   Lazy loading: Don't invoke http.get until the component being initiated and backend data really needed.
*   Avoid service polling backend http while nobody subscribe this service
*   Unsubscribe() and stop any unnecessary http call  as possible to avoid memory leak
*   Use Subject to achieve the two motivations for multiple observers.
*   What if the observer would like to get customized http call from the same service ? example , somebody would like to get compute score from KPI service, and others needs storage score, and those are two different API call. So the service should provide an interface to customize the API call for different observers.





## Other recommended docs for best Practise
* For more details of structural experience, see [NgModules](https://v4.angular.io/guide/ngmodule#feature-modules)
