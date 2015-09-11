'use strict';

var WebSocketServer = require('ws').Server;

var wsServer = new WebSocketServer({ port: 8888 });

var viewers = {};

var collections = {
  viewers: viewers,
  entities: {
    test: {
      id: 'test',
      position: [0, 0],
      size: [800, 600],
      scale: 1,
      params: {}
    }
  }
};

wsServer.broadcast = function (data, skip) {
  wsServer.clients.forEach(function eachClient(client) {
    if (client === skip) return;
    try {
      client.send(data);
    } catch (err) {
      console.warn('send failure:', client.id);
      wsClose(client);
    }
  });
}

wsServer.on('connection', function wsConnection(wsConn) {
  wsConn.id = (Math.floor(1024 + Math.random() * 31743)).toString(32);

  var viewer = viewers[wsConn.id] = {
    id: wsConn.id,
    position: [0, 0],
    size: [0, 0],
    scale: 1,
    params: {}
  };

  wsConn.on('message', function wsIncoming(wsMsg) {
    var msg = JSON.parse(wsMsg),
        obj;

    if (msg.type === 'init') {
      wsConn.send(JSON.stringify({type: 'init', id: wsConn.id}));
      return;
    }

    if (msg.type === 'list') {
      wsConn.send(JSON.stringify({
        type: 'list',
        collection: msg.collection,
        items: collections[msg.collection]
      }));
      return;
    }

    if (msg.type === 'set') {
      collections[msg.collection] = collections[msg.collection] || {};
      obj = collections[msg.collection][msg.id] = msg.item;
      wsServer.broadcast(wsMsg, wsConn);
      return;
    }

    if (msg.type === 'remove') {
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

    if (msg.type === 'zoom') {
      msg.ids;
      return;
    }

    if (msg.type === 'move') {
      obj = collections[msg.collection][msg.id];
      obj.position[0] += msg.offset[0];
      obj.position[1] += msg.offset[1];
      wsServer.broadcast(wsMsg, wsConn);
      return;
    }

    if (msg.type === 'scale') {
      return;
    }

    throw new Error('Invalid message');
  });

  wsConn.on('close', wsClose.bind(null, wsConn));
});

function wsClose(wsConn) {
  if (!viewers[wsConn.id]) return;
  var viewer = viewers[wsConn.id];
  delete viewers[wsConn.id];
  wsServer.broadcast(JSON.stringify({
    type: 'remove',
    collection: 'viewers',
    id: viewer.id
  }), wsConn);
}
