'use strict';

var WebSocketServer = require('ws').Server;

var wsServer = new WebSocketServer({ port: 8888 });

var viewers = {};

wsServer.broadcast = function (data, skip) {
  console.log('broadcast:', data);
  wsServer.clients.forEach(function eachClient(client) {
    if (client === skip) return;
    try {
      client.send(data);
    } catch (err) {
      wsClose(client);
    }
  });
}

wsServer.on('connection', function wsConnection(wsConn) {
  wsConn.id = (Math.floor(1024 + Math.random() * 31743)).toString(32);
  var viewer = viewers[wsConn.id] = {
    id: wsConn.id,
    position: [0, 0],
    size: [0, 0]
  };

  console.log('connection:', wsConn.id, viewer);
  wsConn.send(JSON.stringify({type: 'init', id: wsConn.id, viewers: viewers}));
  // console.log('viewers:', viewers);

  wsConn.on('message', function wsIncoming(wsMsg) {
    console.log('message:', wsMsg);
    var msg = JSON.parse(wsMsg),
        other;

    if (msg.type === 'reg') {
      viewer.position = msg.position;
      viewer.size = msg.size;
      wsServer.broadcast(wsMsg, wsConn);
      return;
    }

    if (msg.type === 'pan') {
      Object.keys(viewers).forEach(function (id) {
        var viewer = viewers[id];
        viewer.position[0] += msg.offset[0];
        viewer.position[1] += msg.offset[1];
      });
      wsServer.broadcast(wsMsg, wsConn);
      return;
    }

    // if (msg.type === 'zoom') {
    //   return;
    // }

    if (msg.type === 'move') {
      other = viewers[msg.id];
      other.position[0] += msg.offset[0];
      other.position[1] += msg.offset[1];
      wsServer.broadcast(wsMsg, wsConn);
      return;
    }

    // if (msg.type === 'scale') {
    //   return;
    // }

    throw new Error('Invalid message');
  });

  wsConn.on('close', wsClose.bind(null, wsConn));
});

function wsClose(wsConn) {
  console.log('close:', wsConn.id);
  if (!viewers[wsConn.id]) return;
  var viewer = viewers[wsConn.id];
  delete viewers[wsConn.id];
  wsServer.broadcast(JSON.stringify({
    type: 'unreg',
    viewer: viewer
  }));
}
