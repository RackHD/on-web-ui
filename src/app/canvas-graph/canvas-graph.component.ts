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
import { CONSTS } from '../../config/consts';
import { Task } from '../models';

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
  initSize: any;

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
    this.canvas = new global.LGraphCanvas(
      this.element.nativeElement.querySelector('canvas'),
      this.graph
      // {autoresize: true}
    );
    this.canvas.clear();
    this.canvas.getNodeMenuOptions = this.getNodeMenuOptions();
    this.canvas.getCanvasMenuOptions = this.getCanvasMenuOptions();
    // this.canvas.default_link_color =  "#AAC"; //Connection color
    // this.canvas.highquality_render = true; //Render color, curve and arrow
    // this.canvas.render_curved_connections = true;
    // this.canvas.render_connection_arrows = true;
    this.canvas.background_image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/wAALCAGAAqgBAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAA/AKpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//9k='
    this.canvas.title_text_font = "bold 12px Arial";
    this.canvas.inner_text_font = "normal 10px Arial";
    this.canvas.render_shadows = false; //Node shadow
    this.canvas.render_connections_border = false;
    this.canvas.show_info = false; //Hide info on left-top corner

    // Set to false will lead to default background rendered after refreshing.
    this.canvas.always_render_background = true;

    this.graph.start();

    // set json
    this.drawNodes();
    this.setCanvasSize();
  }

  setCanvasSize() {
    this.initSize = {
      height: this.element.nativeElement.parentNode.offsetHeight,
      width: this.element.nativeElement.parentNode.offsetWidth
    };
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
      let filterInputHtml = '<input id=\'graphNodeTypeFilter\' placeholder=\'filter\'>';

      // just mock here, should be gotten from backend service
      let node_types = ['Task.poller', 'Task.smi'];
      let values = [];
      values.push({content: filterInputHtml});
      for (let i in node_types)
        values.push({content: node_types[i]});
      let taskMenu = new global.LiteGraph.ContextMenu(values, {
        event: e,
        callback: innerCreate,
        parentMenu: preMenu,
        allow_html: true
      }, ref_window);

      // ==== begin for search ====
      // functions  to implements search
      let taskFilter = new Subject();

      function inputTerm(term: string) {
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
          parentMenu: preMenu,
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

      // click actions of task list menu
      function innerCreate(v, e) {
        // keep menu after click input bar
        if (v.content === filterInputHtml) {
          return true;
        }

        let firstEvent = preMenu.getFirstEvent();
        let node = global.LiteGraph.createNode('rackhd/task_1');
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
    this.graph.clear(); //Krein: (TODO) restore background
    let taskWaitOnKey = 'waitingOn';
    let taskIdentifierKey = 'instanceId';

    // this is for workflow defination
    if (!this.workflow.instanceId) {
      taskWaitOnKey = 'waitOn';
      taskIdentifierKey = 'label';
    }

    let positionMatrix = this.distributePosition(taskWaitOnKey, taskIdentifierKey);
    let chainResult = chainNodes.bind(this)(taskWaitOnKey, taskIdentifierKey);
    console.log(chainResult);
    let helperMap = chainResult[0];
    let isolatedTasks = chainResult[1];

    // Flatten task array
    let helperMapOnlyKey = _.keys(helperMap)[0];
    if (helperMapOnlyKey) {
      _.forEach(isolatedTasks, (task) => {
        if (task[taskIdentifierKey] === helperMapOnlyKey) {
          helperMap[helperMapOnlyKey] = [task].concat(helperMap[helperMapOnlyKey]);
        } else {
          helperMap[helperMapOnlyKey].push(task);
        }
      });
      this.workflow.tasks = _.values(helperMap)[0];
    }


    // add nodes
    _.forEach(this.workflow.tasks, (task, index) => {
      let waitOnLength = _.keys(task[taskWaitOnKey]).length;
      let taskNodeName = 'rackhd/task_' + waitOnLength;
      let taskNode = global.LiteGraph.createNode(taskNodeName);
      let position = positionMatrix[task[taskIdentifierKey]];
      taskNode.title = task.label;
      taskNode.properties.task = task;
      taskNode.state = task.state;

      taskNode.pos = [
        position[0],
        position[1]
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
      if (task.state === 'failed' || task.state === 'error' || task.state === "cancelled") {
        taskNode.properties.log = task.error;
      }

      this.graph.add(taskNode);
    });

    // draw links
    let allNodes = _.flatten([
      this.graph.findNodesByType('rackhd/task_0'),
      this.graph.findNodesByType('rackhd/task_1'),
      this.graph.findNodesByType('rackhd/task_2'),
      this.graph.findNodesByType('rackhd/task_3')
    ]);
    _.forEach(allNodes, (taskNode, index) => {
      let task = taskNode.properties.task;

      // for editor: workflow define
      if (task.waitOn && !_.isEmpty(task.waitOn)) {
        let originNode = _.find(allNodes, (node) => node.title === _.keys(task.waitOn)[0]);
        let originSlot = _.findIndex(originNode.outputs, (o) => {
          return (o as any).name === _.values(task.waitOn)[0];
        });
        originNode.connect(originSlot, taskNode, 0);
      }

      // for viewer: running workflow
      if (task.waitingOn && !_.isEmpty(task.waitingOn)) {
        let slot = 0;
        _.forEach(_.keys(task.waitingOn), waitOnTask => {
          let originNode = _.find(allNodes, (node) => {
            return node.properties.task[taskIdentifierKey] === waitOnTask;
          });
          let originSlot = _.findIndex(originNode.outputs, (o) => {
            let waitOnStatus = task.waitingOn[waitOnTask];
            if (typeof waitOnStatus === 'object') {
              return (o as any).name === waitOnStatus[0];
            } else {
              return task.waitingOn[waitOnTask];
            }
          });
          originNode.connect(originSlot, taskNode, slot);
          slot += 1;
        });
      }
    });

    // end draw

    function chainNodes(waitOnKey, identifierKeyName) {
      let helperMap = {};
      let isolatedTasks = [];
      _.forEach(this.workflow.tasks, (task) => {
        if (task[waitOnKey] && !_.isEmpty(task[waitOnKey])) {
          let waitOnTaskKeys = _.keys(task[waitOnKey]);
          _.forEach(waitOnTaskKeys, key => { //There can be multiple waitOns
            (helperMap[key] || (helperMap[key] = [])).push(task);
          });
        } else {
          isolatedTasks.push(task);
        }
      });
      while (_.keys(helperMap).length > 1) {
        _.forEach(helperMap, (taskArray, waitingOnTask) => {
          _.forEach(taskArray, (task) => {
            if (task[identifierKeyName] in helperMap) {
              helperMap[waitingOnTask] = _.uniq(
                helperMap[waitingOnTask].concat(helperMap[task[identifierKeyName]])
              );
              delete helperMap[task[identifierKeyName]];
            }
          });
        });
      }
      return [helperMap, isolatedTasks];
    }
  }

  /* helper of node positions
   *
   * @param {String}: taskWaitOnKey: key used for link, should be "waitingOn" or "waitOn"
   * @param {String}: taskIdKeyName: key used to identify tasks, should be "instacneId" or "label"
   *
   */
  distributePosition(taskWaitOnKey, taskIdKeyName) {
    let self = this;
    let xOffset = 30;
    let yOffset = 60;
    let xGridSizeMin = 200; // Avoid overlap between adjacent task blocks
    let yGridSizeMin = 100;
    let positionMatrix = {};

    let canvasWidth = parseInt(this.editorCanvas.nativeElement.offsetWidth);
    let canvasHeight = parseInt(this.editorCanvas.nativeElement.offsetHeight);

    let waitOnsList = getWaitOnsList();
    let colPosMatrix = generateColPos(waitOnsList);
    let rowPosMatrix = generateRowPos(colPosMatrix, waitOnsList);

    let colCount = _.max(_.values(colPosMatrix)) + 1;
    let rowCount = _.max(_.values(rowPosMatrix)) + 1;
    let xGridSize = _.max([canvasWidth / colCount, xGridSizeMin]);
    let yGridSize = _.max([canvasHeight / rowCount, yGridSizeMin]);

    _.forEach(this.workflow.tasks, task => {
      let taskId = task[taskIdKeyName];
      let x = colPosMatrix[taskId];
      let y = rowPosMatrix[taskId];
      x = xGridSize * x + xOffset;
      y = yGridSize * y + yOffset;
      positionMatrix[taskId] = [parseInt(x), parseInt(y)];
    })

    function getWaitOnsList(): any {
      return _.transform(self.workflow.tasks, (result, value, key) => {
        let _value: Task = value as Task;
        result[_value[taskIdKeyName]] = _value[taskWaitOnKey];
      }, {});
    }

    function generateColPos(waitOnsList: any): any {
      let colPosMatrix = {};
      _.forEach(waitOnsList, (waitOns, taskId) => {
        generateColPosForTask(taskId, colPosMatrix, waitOnsList);
      });
      return colPosMatrix;
    }

    function generateColPosForTask(taskId: string, colPosMatrix: any, waitOnsList: any): number {
      let waitOns = waitOnsList[taskId];
      let colPos: number;
      let waitOnsColIndex: any[];
      if (_.isUndefined(waitOns) || _.isEmpty(waitOns)) {
        //Task column position is assigned once identified to save for loop.
        colPosMatrix[taskId] = 0;
        return 0;
      }
      waitOnsColIndex = getWaitOnsColIndex(waitOns)
      //Each task will be placed after all tasks it waits on.
      //Thus a task will be placed 1 grid after the wait-on task that has maximum column index;
      colPos = _.max(waitOnsColIndex) + 1;
      //Task column position is assigned once identified to save iterations/recursions
      colPosMatrix[taskId] = colPos;

      function getWaitOnsColIndex(waitOns: any): any[] {
        let colIndexes = [];
        _.forEach(waitOns, (waitOn, waitOnTask) => {
          if (!_.isUndefined(colPosMatrix[waitOnTask])) {
            colIndexes.push(colPosMatrix[waitOnTask]);
          } else {
            let waitOnTaskCol = generateColPosForTask(waitOnTask, colPosMatrix, waitOnsList);
            colIndexes.push(waitOnTaskCol);
          }
        });
        return colIndexes;
      }

      return colPos;
    }

    function generateRowPos(colPosMatrix: any, waitOnsList: any): any {
      let rowPosMatrix = {};
      let sortedTasks = sortTaskByCol(colPosMatrix);

      //First column task's row position is arranged by its appearing sequence
      let rowIndex = 0;
      _.forEach(sortedTasks[0], task => {
        rowPosMatrix[task] = rowIndex;
        rowIndex += 1;
      });

      //Non-first column task's row position follow its waitOn tasks
      for (let colIndex = 1; colIndex < sortedTasks.length; colIndex += 1) {
        let preColTasks = sortedTasks[colIndex - 1];
        let curColTasks = sortedTasks[colIndex];
        generateRowPosForCol(curColTasks, preColTasks, rowPosMatrix);
      }

      return rowPosMatrix;
    }

    //Get row index for tasks in a column
    function generateRowPosForCol(curColTasks: string[], preColTasks: string[], rowPosMatrix: any) {
      let rowIndex = 0;
      _.forEach(preColTasks, preTask => {
        _.forEach(curColTasks, task => {
          let waitOnTasks = _.keys(waitOnsList[task]);
          let taskRowPos: number;
          if (_.includes(waitOnTasks, preTask)) {
            taskRowPos = rowIndex;
            //Keep row position below its waitOnTasks.
            if (taskRowPos < rowPosMatrix[preTask]) {
              taskRowPos = rowPosMatrix[preTask];
            }
            rowIndex = taskRowPos + 1;
            rowPosMatrix[task] = taskRowPos;
          }
        })
      });
    }

    //Sort tasks by column index
    function sortTaskByCol(colPosMatrix) {
      let taskMatrix = [];
      _.forEach(colPosMatrix, (colIndex, taskId) => {
        if (taskMatrix[colIndex]) {
          taskMatrix[colIndex].push(taskId);
        } else {
          taskMatrix[colIndex] = [taskId];
        }
      });
      return taskMatrix;
    };

    return positionMatrix;
  }
}
