'use strict';

var jsonServer = require('json-server');

var server = jsonServer.create();

server.use(jsonServer.defaults);

function attachDates(obj) {
  obj.createdAt = Date.now() - (Math.random() * 100000 + 10000);
  obj.updatedAt = Date.now() - (Math.random() * 10000);
  return obj;
}

server.use(jsonServer.router({
  nodes: [
    {
      id: 1,
      name: 'Node A'
    },
    {
      id: 2,
      name: 'Node B'
    },
    {
      id: 3,
      name: 'Node C'
    }
  ].map(attachDates),
  workflows: [
    {
      id: 1,
      name: 'Restart Node'
    },
    {
      id: 2,
      name: 'Install Puppy Linux'
    },
    {
      id: 3,
      name: 'Cast Magic Missle'
    }
  ],
  tasks: [
    {
      id: 1,
      name: 'Task A'
    }
  ],
  activities: [
    {
      id: 1,
      status: 'Done',
      workflowId: 1
    }
  ],
  jobs: [
    {
      id: 1,
      name: 'Lala Foofoo'
    }
  ]
}));

server.listen(80, function (err) {
  if (err) { throw err; }
  console.log('Running mock api server on port 80...');
});
