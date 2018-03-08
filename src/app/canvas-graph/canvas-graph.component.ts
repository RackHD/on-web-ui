import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import * as _ from 'lodash';
import { NodeExtensionService } from './node-extension.service';
import { WorkflowService } from '../services/workflow.service';
import { CONSTS } from '../consts';

const global = (window as any);

@Component({
  selector: 'app-canvas-graph',
  templateUrl: './canvas-graph.component.html',
  styleUrls: ['./canvas-graph.component.css']
})

export class CanvasGraphComponent implements OnInit {
  @ViewChild('mycanvas') editorCanvas: any;
  @ViewChild('jsoneditor') jsonEditor: any;
  @Input() onWorkflowInput: any;
  @Input() editable = true;
  @Output() onWorkflowChanged = new EventEmitter();

  workflow: any;
  canvas: any;
  graph: any;

  constructor(public element: ElementRef,
              public nodeExtensionService: NodeExtensionService,
              public workflowService: WorkflowService) {
    this.nodeExtensionService.init(
      // use bind to keep context
      this.afterInputConnect.bind(this),
      this.afterInputDisconnect.bind(this),
      this.afterClick.bind(this)
    );
  }

  ngOnInit() {
    this.onWorkflowInput.subscribe(
      workflow => {
        if (!_.isEqual(this.workflow, workflow)) {
          this.workflow = workflow;
          this.afterWorkflowUpdate(true);
        }
      }
    );
    this.graph = new global.LGraph();
    this.canvas = new global.LGraphCanvas(this.element.nativeElement.querySelector('canvas'), this.graph);

    // overwrite canvas prototype method to inject customized logic
    this.canvas.getNodeMenuOptions = this.getNodeMenuOptions();
    this.canvas.getCanvasMenuOptions = this.getCanvasMenuOptions();

    this.graph.start();

    // set json
    this.drawNodes();
  }


  // refresh graph
  afterWorkflowUpdate(reRender = false) {
    this.onWorkflowChanged.emit(_.cloneDeep(this.workflow));
    if (reRender) {
      this.drawNodes();
    }
  }

  // workflow operations
  addTaskForWorkflow(task: any) {
    this.workflow.tasks.push(task);
    this.afterWorkflowUpdate();
  }

  delTaskForWorkflow(task: any) {
    _.remove(this.workflow.tasks, (t) => _.isEqual(task, t));
    this.afterWorkflowUpdate();
  }

  /* connect/disconnect callbacks */
  afterInputConnect(taskToBeChanged, preTask, preTaskResult) {
    if (preTaskResult === CONSTS.taskResult.failed) {
      this.changeTaskWaitOn(taskToBeChanged, preTask, CONSTS.waitOn.failed);
    } else if (preTaskResult === CONSTS.taskResult.succeeded) {
      this.changeTaskWaitOn(taskToBeChanged, preTask, CONSTS.waitOn.succeeded);
    } else if (preTaskResult === CONSTS.taskResult.finished) {
      this.changeTaskWaitOn(taskToBeChanged, preTask, CONSTS.waitOn.finished);
    }
  }

  afterInputDisconnect(taskToBeChanged) {
    this.changeTaskWaitOn(taskToBeChanged);
  }

  afterClick(e, node) {
    if (!node || !node.properties)
      return;

    let self = this;
    let canvas = global.LGraphCanvas.active_canvas;
    let ref_window = canvas.getCanvasWindow();

    let entries = [];
    let value = node.properties.log;
    // if value could contain invalid html characters, clean that
    // value = global.LGraphCanvas.decodeHTML(value);
    // for better view, please
    //   ****value.replace(/\n/g, "<br>"); !important****

    entries.push({
      content: '<span id="errorLogText">' + value + '</span><h4>click to clipboard</h4>',
      value: value
    });
    if (!entries.length)
      return;

    let menu = new global.LiteGraph.ContextMenu(entries, {
      event: e,
      callback: copyToClipboard,
      parentMenu: null,
      allow_html: true,
      node: node
    }, ref_window);

    function copyToClipboard() {
      let inp = document.createElement('input');
      document.body.appendChild(inp);
      // for better view, if you replace \n with <br>, please recover them here
      inp.value = document.getElementById('errorLogText').textContent;
      inp.select();
      document.execCommand('copy', false);
      inp.remove();
    }

    return false;
  }

  //helpers
  changeTaskWaitOn(taskToBeChanged, preTask?, waitOnText?) {
    if (!preTask && !waitOnText) {
      _.forEach(this.workflow.tasks, (task) => {
        if (_.isEqual(task, taskToBeChanged)) {
          delete task['waitOn'];
        }
      });
    } else {
      _.forEach(this.workflow.tasks, (task) => {
        if (_.isEqual(task, taskToBeChanged)) {
          task['waitOn'] = _.set({}, preTask.label, waitOnText);
        }
      });
    }
    this.afterWorkflowUpdate();
  }

  /* end connect/disconnect callbacks */

  /* rewrite lib class prototype functions */
  getCanvasMenuOptions() {
    let self = this;
    return function () {
      if (!self.editable) return [];
      let options = [
        {content: 'Add Node', has_submenu: true, callback: self.addNode()}
      ];
      return options;
    };
  }

  addNode() {
    // mothod 1 for keep current context
    let self = this;

    // this function is referenced from lightgraph src.
    return function (node, options, e, preMenu) {
      let preE = e;
      let canvas = global.LGraphCanvas.active_canvas;
      let ref_window = canvas.getCanvasWindow();

      let entries = [];
      entries.push({content: 'rackhd', has_submenu: true});

      // show rackhd menu
      let menu = new global.LiteGraph.ContextMenu(entries, {
        event: e,
        callback: innerClick,
        parentMenu: preMenu
      }, ref_window);

      // show task list menu
      let filterInputHtml = '<input id=\'graphNodeTypeFilter\' placeholder=\'filter\'>';

      function innerClick(v, option, e) {
        // just mock here, should be gotten from backend service
        let node_types = ['Task.poller', 'Task.smi'];
        let values = [];
        values.push({content: filterInputHtml});
        for (let i in node_types)
          values.push({content: node_types[i]});
        let taskMenu = new global.LiteGraph.ContextMenu(values, {
          event: e,
          callback: innerCreate,
          parentMenu: menu,
          allow_html: true
        }, ref_window);

        // ==== begin for search ====
        // functions  to implements search
        let taskFilter = new Subject();

        function inputTerm(term: string) {
          console.log('asd');
          taskFilter.next(term);
        }

        bindInput();
        let filterTrigger = taskFilter.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap((term: string) => {
            reGenerateMenu(term);
            return 'whatever';
          })
        );
        filterTrigger.subscribe();

        //helpers
        function reGenerateMenu(term: string) {
          // close old task list menu and add a new one;
          taskMenu.close(undefined, true);
          // just mock here
          let values = [];
          values.push({content: filterInputHtml});
          let filteredTypes = _.filter(node_types, (type) => type.includes(term));
          for (let i in filteredTypes)
            values.push({content: filteredTypes[i]});
          taskMenu = new global.LiteGraph.ContextMenu(values, {
            event: e,
            callback: innerCreate,
            parentMenu: menu,
            allow_html: true
          }, ref_window);
          // remember to bind new input again, because the old one is destroyed when menu close.
          // remember to add fill the new input with current term, make it more proper.
          bindInput(term);
        }

        function bindInput(initValue = '') {
          let input = document.getElementById('graphNodeTypeFilter');
          if (initValue)
            (input as HTMLInputElement).value = initValue;
          input.addEventListener('input', () => inputTerm((input as HTMLInputElement).value));
        }

        // ==== end for search ====

        return false;
      }


      // click actions of task list menu
      function innerCreate(v, e) {
        // keep menu after click input bar
        if (v.content === filterInputHtml) {
          return true;
        }

        let firstEvent = preMenu.getFirstEvent();
        let node = global.LiteGraph.createNode('rackhd/task');
        if (node) {
          // update node position
          node.pos = canvas.convertEventToCanvas(firstEvent);
          // update node data
          node.properties.task = self.workflowService.getTaskTemplateByType(v.content);
          node.title = node.properties.task.label;
          // add node to canvas
          canvas.graph.add(node);
          // update let workflow
          self.addTaskForWorkflow(node.properties.task);
        }
      }

      return false;
    };
  }

  getNodeMenuOptions() {
    let self = this;
    return function (node) {
      let options = [];
      if (!self.editable) return options;
      if (node.removable !== false)
        options.push(null, {content: 'Remove', callback: self.removeNode.bind(self)});
      if (node.graph && node.graph.onGetNodeMenuOptions)
        node.graph.onGetNodeMenuOptions(options, node);
      return options;
    };
  }

  removeNode(value, options, e, menu, node) {
    // mothod 2 for keep current context: use bind
    this.delTaskForWorkflow(node.properties.task);
    global.LGraphCanvas.onMenuNodeRemove(value, options, e, menu, node);
  }

  /* end rewrite lib class prototype functions */

  drawNodes() {
    if (!this.workflow) return;
    this.graph.clear();
    let coordinateArray = this.distributePosition();

    // sort based on wait on
    // chain running workflow
    let linkPropertyName = 'waitingOn',
      linkKey = 'instanceId';
    let chainResult = chainNodes.bind(this)(linkPropertyName, linkKey);

    // this is for workflow defination
    if (_.isEmpty(chainResult[0])) {
      linkPropertyName = 'wainOn';
      linkKey = 'label';
      chainResult = chainNodes.bind(this)('waitOn', 'label');
    }

    let helperMap = chainResult[0];
    let leftTasks = chainResult[1];

    // chain the first task, and put all isolated in the tail
    let helperMapOnlyKey = _.keys(helperMap)[0];
    if (helperMapOnlyKey) {
      _.forEach(leftTasks, (task) => {
        if (task[linkKey] === helperMapOnlyKey) {
          helperMap[helperMapOnlyKey] = [task].concat(helperMap[helperMapOnlyKey]);
        } else {
          helperMap[helperMapOnlyKey].push(task);
        }
      });
      this.workflow.tasks = _.values(helperMap)[0];
    }


    // add nodes
    _.forEach(this.workflow.tasks, (task, index) => {
      let taskNode = global.LiteGraph.createNode('rackhd/task');
      taskNode.title = task.label;
      taskNode.properties.task = task;
      taskNode.state = task.state;
      taskNode.pos = [
        coordinateArray[index][0] - taskNode.size[0],
        coordinateArray[index][1] - taskNode.size[1]
      ];

      // set color
      if (task.state) {
        let colors = CONSTS.colors;
        let state = task.state;
        let fgColor = colors[state].color;
        let bgColor = colors[state].bgColor;
        if (fgColor) taskNode.color = fgColor;
        if (bgColor) taskNode.bgcolor = bgColor;
      }

      // get error log of invalid tasks
      if (task.state === 'failed' || task.state === 'error') {
        // this is just mock, may be gotten by workflow services:
        //   getLogOfTask(instanceId : string){...}
        //   and then  replace(/\n/g, "<br>"); !important
        taskNode.properties.log =
          'Error: Encountered a failure running remote commands <br>\
            at /RackHD/on-tasks/lib/utils/job-utils/command-util.js:89:23 <br>\
            at tryCatcher (/RackHD/on-core/node_modules/bluebird/js/main/util.js:26:23) <br>\
            at MappingPromiseArray._promiseFulfilled (/RackHD/on-core/node_modules/bluebird/js/main/map.js:56:38) <br>\
            at MappingPromiseArray.init (/RackHD/on-core/node_modules/bluebird/js/main/promise_array.js:92:18) <br>\
            at MappingPromiseArray.init (/RackHD/on-core/node_modules/bluebird/js/main/map.js:29:23) <br>\
            at Async._drainQueue (/RackHD/on-core/node_modules/bluebird/js/main/async.js:128:12)<br> \
            at Async._drainQueues (/RackHD/on-core/node_modules/bluebird/js/main/async.js:133:10)<br> \
            at Immediate.Async.drainQueues [as _onImmediate] (/RackHD/on-core/node_modules/bluebird/js/main/async.js:15:14)<br>\
            at processImmediate [as _immediateCallback] (timers.js:383:17)';
      }

      this.graph.add(taskNode);
    });

    // draw links
    let allNodes = this.graph.findNodesByType('rackhd/task');
    _.forEach(allNodes, (taskNode, index) => {
      let task = taskNode.properties.task;

      // for editor: workflow define
      if (!_.isUndefined(task.waitOn) && !_.isEmpty(task.waitOn)) {
        let originNode = _.find(allNodes, (node) => node.title === _.keys(task.waitOn)[0]);

        let originSlot = _.findIndex(originNode.outputs, (o) => o.name === _.values(task.waitOn)[0]);
        // let originSlot = _.findIndex(originNode.outputs, (o) => o.name === _.values(task.waitOn)[0]);
        originNode.connect(originSlot, taskNode, 0);
      }

      // for viewer: running workflow
      if (!_.isUndefined(task.waitingOn) && !_.isEmpty(task.waitingOn)) {
        let originNode = _.find(allNodes, (node) => node.properties.task.instanceId === _.keys(task.waitingOn)[0]);
        let originSlot = _.findIndex(originNode.outputs, (o) => {
          if (typeof _.values(task.waitingOn)[0] === 'object') {
            return o.name === _.values(task.waitingOn)[0][0];
          } else {
            return _.values(task.waitingOn)[0];
          }
        });
        originNode.connect(originSlot, taskNode, 0);
      }
    });
    // end draw

    // ============================= helpers ==================================
    function chainNodes(linkPropertyName, linkKeyName) {
      let helperMap = {};
      let leftTasks = [];
      // 1 init helperMap
      // waitingOn is running workflow
      _.forEach(this.workflow.tasks, (task) => {
        if (!_.isUndefined(task[linkPropertyName]) && !_.isEmpty(task[linkPropertyName])) {
          let linkKey = _.keys(task[linkPropertyName])[0];
          (helperMap[linkKey] || (helperMap[linkKey] = [])).push(task);
        } else {
          leftTasks.push(task);
        }
      });
      // 2 intergrate into one chain
      while (_.keys(helperMap).length > 1) {
        _.forEach(helperMap, (taskArray, waitingOnInstanceId) => {
          _.forEach(taskArray, (task) => {
            if (task.instanceId in helperMap) {
              helperMap[waitingOnInstanceId] = helperMap[waitingOnInstanceId].concat(helperMap[task.instanceId]);
              delete helperMap[task.instanceId];
            }
          });
        });
      }
      return [helperMap, leftTasks];
    }

  }

  // helper of node positions
  distributePosition() {
    let coordinateArray = [];
    let canvasWidth = this.editorCanvas.nativeElement.offsetWidth;
    let canvasHeight = this.editorCanvas.nativeElement.offsetHeight;
    let tasksNum = this.workflow.tasks.length;

    let index = 0;
    for (; index * index < tasksNum; index++) {
    }

    for (let i = 0; i < index * index; i++) {
      let x = i % index;
      let y = parseInt('' + i / index);
      x = canvasWidth / (index) * (x + 0.5);
      y = canvasHeight / (index) * (y + 0.5);
      coordinateArray.push([x, y]);
    }
    return coordinateArray;
  }
}
