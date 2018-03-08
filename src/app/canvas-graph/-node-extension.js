//Originate js format
/**
  just import once "import node-extension.js"
  but in this format, if you want to inject some component actions into the hook,
  onConnectionsChange for example, then you will meet some problems that about
  import each other between js and ts, so do everyting in angular service will be
  a good idea.
*/

function Task() {
  this.addProperty("task", {});
  this.addInput("pre-task", LiteGraph.EVENT);
  this.addOutput("failed", LiteGraph.EVENT);
  this.addOutput("succeeded", LiteGraph.EVENT);
  this.addOutput("finished", LiteGraph.EVENT);
}

Task.title = "Task";

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

//register in the system
LiteGraph.registerNodeType("basic/sum", MyAddNode );
LiteGraph.registerNodeType("rackhd/task", Task);
