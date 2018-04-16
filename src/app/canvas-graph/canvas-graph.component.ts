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
import * as uuid from 'uuid/v4';

import { NodeExtensionService } from './node-extension.service';
import { CONSTS } from '../../config/consts';
import { Task } from '../models';
import { WorkflowService } from 'app/services/rackhd/workflow.service';
import { GraphTaskService } from 'app/services/rackhd/task.service';

const global = (window as any);

@Component({
  selector: 'app-canvas-graph',
  templateUrl: './canvas-graph.component.html',
  styleUrls: ['./canvas-graph.component.css']
})

export class CanvasGraphComponent implements OnInit {
  @ViewChild('mycanvas') editorCanvas: any;
  @Input() onWorkflowInput: any;
  @Input() editable = true;
  @Output() onWorkflowChanged = new EventEmitter();

  workflow: any;
  canvas: any;
  graph: any;
  initSize: any;
  taskInjectableNames: any;

  constructor(
    public element: ElementRef,
    public nodeExtensionService: NodeExtensionService,
    public graphTaskService: GraphTaskService,
    public workflowService: WorkflowService
  ) {
    this.nodeExtensionService.init(
      // use bind to keep context
      this.afterInputConnect.bind(this),
      this.afterInputDisconnect.bind(this),
      this.afterClick.bind(this)
    );
  }

  ngOnInit() {
    if (this.editable) {
      this.graphTaskService.getAll()
      .subscribe(allTasks => {
        this.taskInjectableNames = allTasks.map(function (item) {
          return item.injectableName;
        });
      });
    }

    this.onWorkflowInput.subscribe(
      workflow => {
        if (!_.isEqual(this.workflow, workflow)) {
          this.workflow = workflow;
          this.afterWorkflowUpdate(true);
        }
      }
    );
    this.graph = new global.LGraph();
    this.setCanvasSize();
    this.canvas = new global.LGraphCanvas(
      this.element.nativeElement.querySelector('canvas'),
      this.graph
      // {autoresize: true}
    );
    this.setupCanvas();
    this.canvas.clear();
    this.canvas.getNodeMenuOptions = this.getNodeMenuOptions();

    /*overwrite default drawBackCanvas to delete border of back canvas */
    this.canvas.drawBackCanvas = this.drawBackCanvas();

    this.canvas.getCanvasMenuOptions = this.getCanvasMenuOptions();
    this.graph.start();
    this.drawNodes();
  }

  /* drawBackCanvas is just to delete the border of canvas */
  drawBackCanvas() {
    return function(){
      var canvas = this.bgcanvas;
      if (canvas.width != this.canvas.width ||
        canvas.height != this.canvas.height) {
        canvas.width = this.canvas.width;
        canvas.height = this.canvas.height;
      }
      if (!this.bgctx)
        this.bgctx = this.bgcanvas.getContext("2d");
      var ctx = this.bgctx;
      if (ctx.start)
        ctx.start();

      //clear
      if (this.clear_background)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

      //reset in case of error
      ctx.restore();
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      if (this.graph) {
        //apply transformations
        ctx.save();
        ctx.scale(this.scale, this.scale);
        ctx.translate(this.offset[0], this.offset[1]);

        //render BG
        if (this.background_image && this.scale > 0.5) {
          ctx.globalAlpha = (1.0 - 0.5 / this.scale) * this.editor_alpha;
          ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
          if (!this._bg_img || this._bg_img.name != this.background_image) {
            this._bg_img = new Image();
            this._bg_img.name = this.background_image;
            this._bg_img.src = this.background_image;
            var that = this;
            this._bg_img.onload = function () {
              that.draw(true, true);
            }
          }

          var pattern = null;
          if (this._pattern == null && this._bg_img.width > 0) {
            pattern = ctx.createPattern(this._bg_img, 'repeat');
            this._pattern_img = this._bg_img;
            this._pattern = pattern;
          }
          else
            pattern = this._pattern;
          if (pattern) {
            ctx.fillStyle = pattern;
            ctx.fillRect(this.visible_area[0], this.visible_area[1], this.visible_area[2] - this.visible_area[0], this.visible_area[3] - this.visible_area[1]);
            ctx.fillStyle = "transparent";
          }

          ctx.globalAlpha = 1.0;
          ctx.imageSmoothingEnabled = ctx.mozImageSmoothingEnabled = ctx.imageSmoothingEnabled = true;
        }

        if (this.onBackgroundRender)
          this.onBackgroundRender(canvas, ctx);

        //DEBUG: show clipping area
        //ctx.fillStyle = "red";
        //ctx.fillRect( this.visible_area[0] + 10, this.visible_area[1] + 10, this.visible_area[2] - this.visible_area[0] - 20, this.visible_area[3] - this.visible_area[1] - 20);

        //bg
        ctx.strokeStyle = "transparent"; //change border to white
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        if (this.render_connections_shadows) {
          ctx.shadowColor = "#000";
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowBlur = 6;
        }
        else
          ctx.shadowColor = "rgba(0,0,0,0)";

        //draw connections
        if (!this.live_mode)
          this.drawConnections(ctx);

        ctx.shadowColor = "rgba(0,0,0,0)";

        //restore state
        ctx.restore();
      }

      if (ctx.finish)
        ctx.finish();

      this.dirty_bgcanvas = false;
      this.dirty_canvas = true; //to force to repaint the front canvas with the bgcanvas
    }
  }

  /* setLiteGraph can change some default color */
  // setLiteGraph(){
  //   global.LiteGraph.NODE_DEFAULT_COLOR = "red";
  //   global.LiteGraph.NODE_DEFAULT_BGCOLOR = "red";
  //   global.LiteGraph.NODE_DEFAULT_BOXCOLOR = "red";
  // }
  setupCanvas() {
    // this.canvas.default_link_color =  "#FFF"; //Connection color
    // this.canvas.highquality_render = true; //Render color, curve and arrow
    // this.canvas.render_curved_connections = false; //Use straight line
    // this.canvas.render_connection_arrows = false; //No arrows for line
    this.canvas.always_render_background = false;
    this.canvas.background_image = ''; //Don't use background
    this.canvas.title_text_font = "bold 12px Arial";
    this.canvas.inner_text_font = "normal 10px Arial";
    this.canvas.render_shadows = false; //Node shadow
    this.canvas.render_connections_border = false;
    this.canvas.show_info = false; //Hide info on left-top corner
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
      _.forEach(this.workflow && this.workflow.tasks, (task) => {
        if (_.isEqual(task, taskToBeChanged)) {
          delete task['waitOn'];
        }
      });
    } else {
      //this.workflow may be undefined.
      _.forEach(this.workflow && this.workflow.tasks, (task) => {
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
        {content: 'Add Task', has_submenu: true, callback: self.addNode()}
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

      let taskNames = self.taskInjectableNames.slice(0, 9);
      let values = [];
      values.push({content: filterInputHtml});
      _.forEach(taskNames, name => {
        values.push({content: name});
      })

      let taskMenu = new global.LiteGraph.ContextMenu(values, {
        event: e,
        callback: innerCreate,
        parentMenu: preMenu,
        allow_html: true
      }, ref_window);

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
        let values = [];
        values.push({content: filterInputHtml});
        let filteredTaskNames = _.filter(self.taskInjectableNames, (type) => type.includes(term));
        for (let injectableName of filteredTaskNames.slice(0, 9)) {
          values.push({content: injectableName});
        }
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
          let injectName = v.content;
          self.graphTaskService.getByIdentifier(injectName)
          .subscribe(task => {
            let data = {};
            let label = "new-task-" + uuid().substr(0, 10);
            _.assign(data, {'label': label});
            _.assign(data, {'taskDefinition': task});
            node.properties.task = data;
            node.title = node.properties.task.label;
            canvas.graph.add(node);
            self.addTaskForWorkflow(node.properties.task);
          });
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
    let taskWaitOnKey = 'waitingOn';
    let taskIdentifierKey = 'instanceId';

    // this is for workflow defination
    if (!this.workflow.instanceId) {
      taskWaitOnKey = 'waitOn';
      taskIdentifierKey = 'label';
    }

    let positionMatrix = this.distributePosition(taskWaitOnKey, taskIdentifierKey);
    let chainResult = chainNodes.bind(this)(taskWaitOnKey, taskIdentifierKey);
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

    let waitOnsMatrix = getWaitOnsMatrix();
    let colPosMatrix = generateColPos(waitOnsMatrix);
    let rowPosMatrix = generateRowPos(colPosMatrix, waitOnsMatrix);

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

    /*
     * Retrieve only taskId-waitOns from workflow task list
     */
    function getWaitOnsMatrix(): any {
      return _.transform(self.workflow.tasks, (result, value, key) => {
        let _value: Task = value as Task;
        result[_value[taskIdKeyName]] = _value[taskWaitOnKey];
      }, {});
    }

    /*
     * Generate column positions for all tasks based on waitOn level depth
     * That is:
     *  if task has no waitOn, its depth is 0;
     *  if task waitOn task has depth 0, its depth is 1;
     *  if task waits on tasks, its depth is max depth it waits on plus 1
     */
    function generateColPos(waitOnsList: any): any {
      let colPosMatrix = {};
      _.forEach(waitOnsList, (waitOns, taskId) => {
        generateColPosForTask(taskId, colPosMatrix, waitOnsList);
      });
      return colPosMatrix;
    }

    /*
     * Get task column position by taskId
     */
    function generateColPosForTask(taskId: string, colPosMatrix: any, waitOnsList: any): number {
      let waitOns = waitOnsList[taskId];
      let colPos: number;
      let waitOnsColPosList: any[];
      if (_.isEmpty(waitOns)) {
        colPos = 0;
      } else {
        //Each task will be placed after all tasks it waits on.
        colPos = _.max(getWaitOnsColPositions(waitOns, colPosMatrix, waitOnsList)) + 1;
      }

      //Task column position is assigned once identified to save iterations/recursions
      colPosMatrix[taskId] = colPos;

      return colPos;
    }

    /*
     * Get all waitOn tasks's column positions
     */
    function getWaitOnsColPositions(waitOns: any, colPosMatrix: any, waitOnsList): number[] {
      let colIndexes = [];
      _.forEach(waitOns, (waitOn, waitOnTask) => {
        if (!_.isUndefined(colPosMatrix[waitOnTask])) {
          colIndexes.push(colPosMatrix[waitOnTask]);
        } else {
          colIndexes.push(generateColPosForTask(waitOnTask, colPosMatrix, waitOnsList));
        }
      });
      return colIndexes;
    }

    /*
     * Generate row position for all tasks that have already had column positions
     * Row position for a task is no less than row position of tasks it waits on
     * Tasks have the same waitOn will be distribute by iterating sequence
     */
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
        let preColTasks = sortedTasks[colIndex - 1]; //waitOn task list for all tasks in current column;
        let curColTasks = sortedTasks[colIndex];
        generateRowPosForCol(curColTasks, preColTasks, rowPosMatrix, waitOnsList);
      }

      return rowPosMatrix;
    }

    /*
     * Get row position for tasks in a column
     */
    function generateRowPosForCol(
      curColTasks: string[],
      preColTasks: string[],
      rowPosMatrix: any,
      waitOnsMatrix: any
    ) {
      let rowIndex = 0;
      _.forEach(preColTasks, preTask => {
        _.forEach(curColTasks, task => {
          let waitOnTasks = _.keys(waitOnsMatrix[task]);
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

    /*
     * Sort tasks by column index
     */
    function sortTaskByCol(colPosMatrix: any): any[] {
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
