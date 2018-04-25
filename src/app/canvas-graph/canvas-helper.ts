import * as _ from 'lodash';
import { CONSTS } from '../../config/consts';

const global = (window as any);

export class DrawUtils {

    private idKey: string;
    private waitOnKey: string;
    private tasks: any [];

    constructor(idKey: string, waitOnKey: string, tasks: any[]) {
      this.idKey = idKey;
      this.waitOnKey = waitOnKey;
      this.tasks = tasks;
    }

    /*
     * Put taskIds into an array in flipped "N" position sequence (Top-down in
     * a column then left-right for all columns)
     */
    public sortTaskIdsByPos(colMatrix, rowMatrix): string[] {
      let locatedTaskIds: string[][] = [];
      _.forEach(colMatrix, (col, taskId) => {
        let row = rowMatrix[taskId];
        locatedTaskIds[col] = locatedTaskIds[col] || [];
        locatedTaskIds[col][row] = taskId;
      });

      // Remove taskIds in last column
      // Last column connection is covered by its previous columns
      locatedTaskIds.pop();

      return _.compact(_.flatten(locatedTaskIds));
    }

    /*
     * Retrieve tasksId-waitedBys from workflow task list
     */
    public getWaitedBysMatrix(tasks: any[]): any {
      let waitedBys = {};
      _.forEach(tasks, task => {
        _.forEach(task[this.waitOnKey], (value, key) => {
          waitedBys[key] = waitedBys[key] || {};
          waitedBys[key][task[this.idKey]] = value;
        })
      });
      return waitedBys;
    }

    /*
     * Create canvas node object for a task
     */
    public createTaskNode(task: any, position): any{
      let waitOnLength = _.keys(task[this.waitOnKey]).length;
      let taskNodeName = 'rackhd/task_' + waitOnLength;
      let taskNode = global.LiteGraph.createNode(taskNodeName);
      taskNode.title = task.label;
      taskNode.properties.task = task;
      taskNode.state = task.state;
      taskNode.pos = [position[0], position[1]];

      if (task.state) {
        let colors = CONSTS.colors;
        let state = task.state;
        let fgColor = colors[state].color;
        let bgColor = colors[state].bgColor;
        if (fgColor) taskNode.color = fgColor;
        if (bgColor) taskNode.bgcolor = bgColor;
      }

      // get error log of invalid tasks
      if (task.state === 'failed' || task.state === 'error' ||
        task.state === "cancelled" || task.state === "timeout") {
        taskNode.properties.log = task.error;
      }
      return taskNode;
    }

    /*
     * Connect task nodes
     */
    public connectNodes(allTaskIds, taskNodeMatrix, taskSlotMatrix) {
      let waitedBysMatrix = this.getWaitedBysMatrix(this.tasks);
      _.forEach(allTaskIds, (taskId) => {
        let curNode = taskNodeMatrix[taskId];
        let task = curNode.properties.task;
        let waitedByTasks = waitedBysMatrix[taskId];
        _.forEach(waitedByTasks, (states, taskId) => {
          let state: string;
          let nextNode = taskNodeMatrix[taskId];

          // To be compatible with different kinds of waitOn values in RackHD code
          if (states as any instanceof Array) {
            state = states.length > 1 ? CONSTS.taskResult.finished : states[0];
          } else {
            state = states;
          }

          curNode.connect(CONSTS.outputSlots[state], nextNode, taskSlotMatrix[taskId]);
          taskSlotMatrix[taskId] += 1;
        })
      });
    }

  /*
   * drawBackCanvas is just to delete the border of canvas
   */
  public static drawBackCanvas() {
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

}

export class PositionUtils {

    private tasks: any [];
    private idKey: string;
    private waitOnKey: string;

    constructor(tasks, idKey, waitOnKey) {
      this.tasks = tasks;
      this.idKey = idKey;
      this.waitOnKey = waitOnKey;
    }

    /*
     * Retrieve only taskId-waitOns from workflow task list
     */
    public getWaitOnsMatrix(): any {
      return _.transform(this.tasks, (result, value, key) => {
        let _value: any = value as any;
        result[_value[this.idKey]] = _value[this.waitOnKey];
      }, {});
    }

    /*
     * Generate column positions for all tasks based on waitOn level depth
     * That is:
     *  if task has no waitOn, its depth is 0;
     *  if task waitOn task has depth 0, its depth is 1;
     *  if task waits on tasks, its depth is max depth it waits on plus 1
     */
    public generateColPos(waitOnsList: any): {[propName: string]: number} {
      let colPosMatrix = {};
      _.forEach(waitOnsList, (waitOns, taskId) => {
        this.generateColPosForTask(taskId, colPosMatrix, waitOnsList);
      });
      return colPosMatrix;
    }

    /*
     * Get task column position by taskId
     */
    private generateColPosForTask(taskId: string, colPosMatrix: any, waitOnsList: any): number {
      let waitOns = waitOnsList[taskId];
      let colPos: number;
      let waitOnsColPosList: any[];
      if (_.isEmpty(waitOns)) {
        colPos = 0;
      } else {
        //Each task will be placed after all tasks it waits on.
        colPos = _.max(this.getWaitOnsColPositions(waitOns, colPosMatrix, waitOnsList)) + 1;
      }

      //Task column position is assigned once identified to save iterations/recursions
      colPosMatrix[taskId] = colPos;

      return colPos;
    }

    /*
     * Get all waitOn tasks's column positions
     */
    private getWaitOnsColPositions(waitOns: any, colPosMatrix: any, waitOnsList): number[] {
      let colIndexes = [];
      _.forEach(waitOns, (waitOn, waitOnTask) => {
        if (!_.isUndefined(colPosMatrix[waitOnTask])) {
          colIndexes.push(colPosMatrix[waitOnTask]);
        } else {
          colIndexes.push(this.generateColPosForTask(waitOnTask, colPosMatrix, waitOnsList));
        }
      });
      return colIndexes;
    }

    /*
     * Generate row position for all tasks that have already had column positions
     * Row position for a task is no less than row position of tasks it waits on
     * Tasks have the same waitOn will be distribute by iterating sequence
     */
    public generateRowPos(colPosMatrix: any, waitOnsList: any): {[propName: string]: number} {
      let rowPosMatrix = {};
      let sortedTasks = this.sortTaskByCol(colPosMatrix);

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
        this.generateRowPosForCol(curColTasks, preColTasks, rowPosMatrix, waitOnsList);
      }

      return rowPosMatrix;
    }

    /*
     * Get row position for tasks in a column
     */
    private generateRowPosForCol(
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
    private sortTaskByCol(colPosMatrix: any): any[] {
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
}
