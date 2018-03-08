import { Injectable } from '@angular/core';
import { WorkflowService } from '../services/workflow.service';
import { CONSTS } from '../consts';
// import once to inject this script to window.
let win = (window as any);

@Injectable()
export class NodeExtensionService {
    initialized = false;

    // inject customized login into node hooks
    init(connectCb, disconnectCb, clickCb){
      if(this.initialized) return;
      // inject hook actions
      Task.prototype.onConnectionsChange = function(connection, slot, connected, link_info){
        if(connection===win.LiteGraph.OUTPUT){
        }
        if(connection===win.LiteGraph.INPUT){
          let targetNode = this.graph.getNodeById( link_info.target_id );
          let originNode = this.graph.getNodeById(link_info.origin_id);
          let originOutput = originNode.outputs[link_info.origin_slot];
          let originOutputName = originOutput.name;
          let task = targetNode.properties.task;
          let pretask = originNode.properties.task;

          if(!task){
            console.log("error, please put task into node properties when init")
          }
          if(connected){
            connectCb(task, pretask, originOutputName);
          } else {
            disconnectCb(task, pretask, originOutputName);
          }
        }
      }

      // set customized view, for example: show error log
    	Task.prototype.onDrawForeground = function(ctx)
    	{
    		if(this.flags.collapsed)
    			return;
        if(this.state !== 'failed' && this.state !== 'error')
          return;

    		//ctx.font = "40px Arial";
    		//ctx.textAlign = "center";
    		ctx.fillStyle = "black";
    		ctx.fillRect(1,this.size[1]/2,this.size[0]/2 - 3, this.size[1]/2 - 3);
    		ctx.fillStyle = "#AAF";
    		ctx.fillRect(0,this.size[1]/2-1,this.size[0]/2 - 3, this.size[1]/2 - 3);
    		ctx.fillStyle = this.clicked ? "white" : (this.mouseOver ? "#e6d7cb" : "#dfbda3");
    		ctx.fillRect(1,this.size[1]/2,this.size[0]/2 - 4, this.size[1]/2 - 4);

  			ctx.textAlign = "center";
  			ctx.fillStyle = this.clicked ? "black" : "#c25400";
  			if( this.properties.font )
  				ctx.font = this.properties.font;
  			ctx.fillText("error log", this.size[0] * 0.25, this.size[1] * 0.8 );
    	}

      Task.prototype.onMouseDown = function(e, local_pos)
    	{
    		if(local_pos[0] > 1 && local_pos[1] > this.size[1]/2 && local_pos[0] < (this.size[0]/2 - 2) && local_pos[1] < (this.size[1] - 2) )
    		{
    			this.clicked = true;
    			this.trigger( "clicked", this.properties.message );
          clickCb(e, this);
    			return true;
    		}
    	}

    	Task.prototype.onMouseUp = function(e)
    	{
    		this.clicked = false;
    	}

      //register in the system after inject actions
      win.LiteGraph.registerNodeType("rackhd/task", Task);
      this.initialized = true;
    }
}



// node classes
class Task {
  // prevent ts error
  onDrawForeground: any;
  onConnectionsChange: any;
  onMouseDown:any;
  onMouseUp: any;
  title = "Task";
  state: string;
  addInput: any;
  addProperty: any;
  addOutput: any;

  constructor(){
    this.addProperty("task", {});
    this.addProperty("log", {});
    this.addInput("pre-task", win.LiteGraph.EVENT);
    this.addOutput(CONSTS.taskResult.failed, win.LiteGraph.EVENT);
    this.addOutput(CONSTS.taskResult.succeeded, win.LiteGraph.EVENT);
    this.addOutput(CONSTS.taskResult.finished, win.LiteGraph.EVENT);
  }
}
