//Originate ts format
/**
  detached from the angular framework, just pure ts class, not recommanded.
*/

// can't use keyword "global" in service
const win = (window as any);

class Task {
  // prevent ts error
  onConnectionsChange: any;
  title = "Task";
  addInput: any;
  addProperty: any;
  addOutput: any;

  constructor(){
    this.addProperty("task", {});
    this.addInput("pre-task", win.LiteGraph.EVENT);
    this.addOutput("failed", win.LiteGraph.EVENT);
    this.addOutput("succeeded", win.LiteGraph.EVENT);
    this.addOutput("finished", win.LiteGraph.EVENT);
  }
}

Task.prototype.onConnectionsChange = function(connection, slot, connected, link_info){
  if(connection===win.LiteGraph.OUTPUT){
    console.log("output")
  }
  if(connection===win.LiteGraph.INPUT){
    console.log("input")
    console.log(connection);
    console.log(slot);
    console.log(connected);
    console.log(link_info);

    var target_node =this.graph.getNodeById( link_info.target_id );
    console.log(target_node)
  }
}

//register in the system
win.LiteGraph.registerNodeType("rackhd/task", Task);
