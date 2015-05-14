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
  activities: [
    {
      id: 1,
      status: 'Done',
      workflowId: 'Graph.Noop'
    }
  ],
  workflows: [
    {
      id: 'Graph.Noop',
      name: 'No-Op Graph',
      tasks: [
        {
          label: 'noop-1',
          taskName: 'Task.noop'
        },
        {
          label: 'noop-2',
          taskName: 'Task.noop',
          waitOn: {
            'noop-1': 'finished'
          }
        },
        {
          label: 'parallel-noop-1',
          taskName: 'Task.noop',
          waitOn: {
            'noop-2': 'finished'
          }
        },
        {
          label: 'parallel-noop-2',
          taskName: 'Task.noop',
          waitOn: {
            'noop-2': 'finished'
          }
        }
      ]
    },
    {
      id: 'Graph.PowerOn',
      name: 'Power On',
      tasks: [
        {
          label: 'poweron',
          taskName: 'Task.PowerOn'
        }
      ]
    },
    {
      id: 'Graph.PowerOff',
      name: 'Power Off',
      tasks: [
        {
          label: 'poweroff',
          taskName: 'Task.PowerOff'
        }
      ]
    },
    {
      id: 'Graph.Reboot',
      name: 'Reboot',
      tasks: [
        {
          label: 'run-poweroff',
          taskName: 'Task.RunGraph',
          options: {
            graphName: 'Graph.PowerOff',
            graphOptions: {}
          }
        },
        {
          label: 'run-poweron',
          taskName: 'Task.RunGraph',
          waitOn: {
            'run-poweroff': 'succeeded'
          },
          options: {
            graphName: 'Graph.PowerOn',
            graphOptions: {}
          }
        }
      ]
    },
    {
      id: 'Graph.InstallPuppyLinux',
      name: 'Install Puppy Linux',
      tasks: [
        {
          label: 'run-reboot',
          taskName: 'Task.RunGraph',
          options: {
            graphName: 'Graph.Reboot',
            graphOptions: {}
          }
        },
        {
          label: 'installpuppylinux',
          taskName: 'Task.InstallOS',
          waitOn: {
            'run-reboot': 'finished'
          },
          options: {
            imageName: 'puppylinux'
          }
        }
      ]
    },
    {
      id: 'Graph.CastMagicMissle',
      name: 'Cast Magic Missle',
      tasks: [
        {
          label: 'runcmd-manacheck',
          taskName: 'Task.RunCommand',
          options: {
            command: 'mana-check'
          }
        },
        {
          label: 'run-delayretry',
          taskName: 'Task.RunGraph',
          waitOn: {
            'runcmd-manacheck': 'failed'
          },
          options: {
            delay: 1000,
            graphName: 'Graph.CastMagicMissle',
            graphOptions: {}
          }
        },
        {
          label: 'runcmd-castspell',
          taskName: 'Task.RunCommand',
          options: {
            command: 'cast-spell magic missle'
          }
        }
      ]
    }
  ],
  tasks: [
    {
      id: 'Task.Noop',
      name: 'No-Op',
      runJob: 'Job.Noop',
      options: {
        option1: 1,
        option2: 2,
        option3: 3
      },
      properties: {
        noop: {
          foo: 'bar'
        }
      }
    },
    {
      id: 'Task.RunGraph',
      name: 'Run Graph',
      runJob: 'Job.RunGraph',
      requiredOptions: [
        'graphName',
        'graphOptions'
      ],
      requiredProperties: {},
      properties: {}
    },
    {
      id: 'Task.PowerOn',
      name: 'Power On',
      runJob: 'Job.PowerOn'
    },
    {
      id: 'Task.PowerOff',
      name: 'Power Off',
      runJob: 'Job.PowerOff'
    },
    {
      id: 'Task.InstallOS',
      name: 'Install OS',
      runJob: 'Job.InstallOS',
      requiredOptions: [
        'profile',
        'completionUri'
      ],
      requiredProperties: {
        'power.state': 'reboot'
      },
      properties: {
        os: {
          type: 'install'
        }
      }
    },
    {
      id: 'Task.RunCommand',
      name: 'Run Command',
      runJob: 'Job.RunCommand',
      requiredOptions: [
        'commands'
      ],
      requiredProperties: {},
      properties: {
        commands: {}
      }
    }
  ],
  jobs: [
    {
      id: 'Job.Noop',
      name: 'No-Op',
      desc: 'Does nothing.'
    },
    {
      id: 'Job.RunGraph',
      name: 'Run Graph',
      desc: 'Executes another workflow.'
    },
    {
      id: 'Job.PowerOn',
      name: 'Power On',
      desc: 'Turn on a node.'
    },
    {
      id: 'Job.PowerOff',
      name: 'Power Off',
      desc: 'Turn off a node.'
    },
    {
      id: 'Job.InstallOS',
      name: 'Install OS',
      desc: 'Install an operating system on a compute node.'
    },
    {
      id: 'Job.RunCommand',
      name: 'Run Command',
      desc: 'Run a command on a compute node.'
    }
  ]
}));

server.listen(80, function (err) {
  if (err) { throw err; }
  console.log('Running mock api server on port 80...');
});
