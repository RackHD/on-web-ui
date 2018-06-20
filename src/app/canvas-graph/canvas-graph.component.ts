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
import { DrawUtils, PositionUtils } from './canvas-helper';
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
    this.canvas = new global.LGraphCanvas(
      this.element.nativeElement.querySelector('canvas'),
      this.graph
    );
    this.setupCanvas();
    this.canvas.clear();
    this.canvas.getNodeMenuOptions = this.getNodeMenuOptions();

    // Overwrite default drawBackCanvas method to delete border of back canvas
    this.canvas.drawBackCanvas = DrawUtils.drawBackCanvas();

    this.canvas.getCanvasMenuOptions = this.getCanvasMenuOptions();
    this.graph.start();
    this.drawNodes();
  }

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
        debounceTime(1000),
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
        let filteredTaskNames = _.filter(self.taskInjectableNames, (type) => {
          return _.toLower(type).includes(_.toLower(term));
        });
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
    this.delTaskForWorkflow(node.properties.task);
    global.LGraphCanvas.onMenuNodeRemove(value, options, e, menu, node);
  }

  drawNodes() {
    if (!this.workflow) return;

    this.graph.clear();

    // For graph object
    let taskWaitOnKey = 'waitingOn';
    let taskIdentifierKey = 'instanceId';

    // For graph definition
    if (!this.workflow.instanceId) {
      taskWaitOnKey = 'waitOn';
      taskIdentifierKey = 'label';
    }

    let positionMatrix: any;
    let colMatrix: {[propName:string]: number};
    let rowMatrix: {[propName:string]: number};
    [positionMatrix, colMatrix, rowMatrix] = this.distributePosition(taskWaitOnKey, taskIdentifierKey);

    let taskNodeMatrix = {};
    let nodeInputSlotIndexes = {};
    let drawUtils = new DrawUtils(taskIdentifierKey, taskWaitOnKey, this.workflow.tasks);
    _.forEach(this.workflow.tasks, (task) => {
      if ( task.taskStartTime && task.state === "pending"){
        task.state = "running";
      }
      let position = positionMatrix[task[taskIdentifierKey]];
      let node = drawUtils.createTaskNode(task, position);
      this.graph.add(node);
      taskNodeMatrix[task[taskIdentifierKey]] = node;
      nodeInputSlotIndexes[task[taskIdentifierKey]] = 0;
    });

    // Remove taskIds in last column
    // Last column connection is covered by its previous columns
    let sortedTaskIds = drawUtils.sortTaskIdsByPos(colMatrix, rowMatrix, true);
    drawUtils.connectNodes(sortedTaskIds, taskNodeMatrix, nodeInputSlotIndexes);
  }

  /*
   * @param {String}: taskWaitOnKey: key used for link, should be "waitingOn" or "waitOn"
   * @param {String}: taskIdKeyName: key used to identify tasks, should be "instacneId" or "label"
   *
   */
  distributePosition(taskWaitOnKey: string, taskIdKeyName: string) {
    let xOffset = 30;
    let yOffset = 60;
    let xGridSizeMin = 200; // Avoid overlap between adjacent task blocks
    let yGridSizeMin = 100;
    let positionMatrix = {};
    let utils = new PositionUtils(this.workflow.tasks, taskIdKeyName, taskWaitOnKey);

    let canvasWidth = parseInt(this.editorCanvas.nativeElement.offsetWidth);
    let canvasHeight = parseInt(this.editorCanvas.nativeElement.offsetHeight);

    let waitOnsMatrix = utils.getWaitOnsMatrix();
    let colPosMatrix = utils.generateColPos(waitOnsMatrix);
    let rowPosMatrix = utils.generateRowPos(colPosMatrix, waitOnsMatrix);

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
      positionMatrix[taskId] = [Math.floor(x), Math.floor(y)];
    })
    return [positionMatrix, colPosMatrix, rowPosMatrix];
  }
}

