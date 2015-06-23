'use strict';

var jsonServer = require('json-server');

var server = jsonServer.create();

server.use(jsonServer.defaults);

function attachDates(obj) {
  obj.createdAt = Date.now() - (Math.random() * 100000 + 10000);
  obj.updatedAt = Date.now() - (Math.random() * 10000);
  return obj;
}

server.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
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
          waitOn: {
            'runcmd-manacheck': 'succeeded'
          },
          options: {
            command: 'cast-spell magic missle'
          }
        }
      ]
    },



    {
        name: 'SKU Discovery',
        id: 'Graph.SKU.Discovery',
        options: {
            defaults: {
                graphOptions: {
                    target: null
                },
                nodeId: null
            }
        },
        tasks: [
            {
                label: 'discovery-graph',
                taskDefinition: {
                    friendlyName: 'Run Discovery Graph',
                    injectableName: 'Task.Graph.Run.Discovery',
                    implementsTask: 'Task.Base.Graph.Run',
                    options: {
                        graphName: 'Graph.Discovery',
                        graphOptions: {}
                    },
                    properties: {}
                }
            },
            {
                label: 'generate-sku',
                waitOn: {
                    'discovery-graph': 'succeeded'
                },
                taskName: 'Task.Catalog.GenerateSku'
            },
            {
                label: 'create-default-pollers',
                taskDefinition: {
                    friendlyName: 'Create Default Pollers',
                    injectableName: 'Task.Inline.Pollers.CreateDefault',
                    implementsTask: 'Task.Base.Pollers.CreateDefault',
                    options: {
                        nodeId: null
                    },
                    properties: {}
                },
                waitOn: {
                    'discovery-graph': 'succeeded'
                }
            },
            {
                label: 'run-sku-graph',
                taskDefinition: {
                    friendlyName: 'Run SKU-specific graph',
                    injectableName: 'Task.Graph.Run.SkuSpecific',
                    implementsTask: 'Task.Base.Graph.RunSku',
                    options: {},
                    properties: {}
                },
                waitOn: {
                    'generate-sku': 'succeeded'
                }

            }
        ]
    },
    {
        'name': 'Flash Quanta BIOS',
        'id': 'Graph.Flash.Quanta.BIOS',
        'options': {
            'defaults': {
                'downloadDir': '/opt/downloads'
            },
            'bootstrap-ubuntu': {
                'overlayfs': 'common/overlayfs_quanta_t41_flash-v1.1-3.13.0-32.cpio.gz'
            },
            'download-bios-firmware': {
                'file': null
            },
            'flash-bios': {
                'file': null
            }
        },
        'tasks': [
            {
                'label': 'set-boot-pxe',
                'taskName': 'Task.Obm.Node.PxeBoot',
                'ignoreFailure': true
            },
            {
                'label': 'reboot',
                'taskName': 'Task.Obm.Node.Reboot',
                'waitOn': {
                    'set-boot-pxe': 'finished'
                }
            },
            {
                'label': 'bootstrap-ubuntu',
                'taskName': 'Task.Linux.Bootstrap.Ubuntu',
                'waitOn': {
                    'reboot': 'succeeded'
                }
            },
            {
                'label': 'download-bios-firmware',
                'taskName': 'Task.Linux.DownloadFiles',
                'waitOn': {
                    'bootstrap-ubuntu': 'succeeded'
                }
            },
            {
                'label': 'catalog-quanta-bios-before',
                'taskName': 'Task.Catalog.ami',
                'waitOn': {
                    'download-bios-firmware': 'succeeded'
                }
            },
            {
                'label': 'provide-quanta-bios-version',
                'taskName': 'Task.Catalogs.Provide.Ami.BiosVersion',
                'waitOn': {
                    'catalog-quanta-bios-before': 'succeeded'
                }
            },
            {
                'label': 'flash-bios',
                'taskName': 'Task.Linux.Flash.Ami.Bios',
                'waitOn': {
                    'provide-quanta-bios-version': 'succeeded'
                }
            },
            {
                'label': 'catalog-quanta-bios-after',
                'taskName': 'Task.Catalog.ami',
                'waitOn': {
                    'flash-bios': 'succeeded'
                }
            },
            {
                'label': 'shell-reboot',
                'taskName': 'Task.ProcShellReboot',
                'waitOn': {
                    'catalog-quanta-bios-after': 'succeeded'
                }
            }
        ]
    },
    {
        name: 'Install CoreOS',
        id: 'Graph.InstallCoreOS',
        tasks: [
            {
                label: 'set-boot-pxe',
                taskName: 'Task.Obm.Node.PxeBoot',
                ignoreFailure: true
            },
            {
                label: 'reboot',
                taskName: 'Task.Obm.Node.Reboot',
                waitOn: {
                    'set-boot-pxe': 'finished'
                }
            },
            {
                label: 'install-coreos',
                taskName: 'Task.Os.Install.CoreOS',
                waitOn: {
                    'reboot': 'succeeded'
                }
            }
        ]
    },
    {
        name: 'Poller Service',
        id: 'Graph.Service.Poller',
        serviceGraph: true,
        options: {
            'clean-workitems': {
                schedulerOverrides: {
                    timeout: -1
                }
            },
            'run-workitems': {
                schedulerOverrides: {
                    timeout: -1
                }
            },
            'ipmi': {
                schedulerOverrides: {
                    timeout: -1
                }
            },
            'snmp': {
                schedulerOverrides: {
                    timeout: -1
                }
            },
            'ipmi-sdr-alert': {
                schedulerOverrides: {
                    timeout: -1
                }
            },
            'ipmi-sel-alert': {
                schedulerOverrides: {
                    timeout: -1
                }
            },
            'snmp-alert': {
                schedulerOverrides: {
                    timeout: -1
                }
            },
            'poller-cache': {
                schedulerOverrides: {
                    timeout: -1
                }
            }
        },
        tasks: [
            {
                label: 'clean-workitems',
                taskDefinition: {
                    friendlyName: 'Clean Poller Work Items',
                    injectableName: 'Task.Inline.Poller.WorkItems.Clean',
                    implementsTask: 'Task.Base.WorkItems.Clean',
                    options: {},
                    properties: {}
                }
            },
            {
                label: 'run-workitems',
                taskDefinition: {
                    friendlyName: 'Run Poller Work Items',
                    injectableName: 'Task.Inline.Poller.WorkItems.Run',
                    implementsTask: 'Task.Base.WorkItems.Run',
                    options: {},
                    properties: {}
                }
            },
            {
                label: 'ipmi',
                taskDefinition: {
                    friendlyName: 'Ipmi requester',
                    injectableName: 'Task.Inline.Ipmi',
                    implementsTask: 'Task.Base.Ipmi',
                    options: {},
                    properties: {}
                }
            },
            {
                label: 'snmp',
                taskDefinition: {
                    friendlyName: 'SNMP requester',
                    injectableName: 'Task.Inline.Snmp',
                    implementsTask: 'Task.Base.Snmp',
                    options: {},
                    properties: {}
                }
            },
            {
                label: 'ipmi-sdr-alert',
                taskDefinition: {
                    friendlyName: 'IPMI Sdr alerter',
                    injectableName: 'Task.Inline.Poller.Alert.Ipmi.Sdr',
                    implementsTask: 'Task.Base.Poller.Alert.Ipmi.Sdr',
                    options: {},
                    properties: {}
                }
            },
            {
                label: 'ipmi-sel-alert',
                taskDefinition: {
                    friendlyName: 'IPMI Sel alerter',
                    injectableName: 'Task.Inline.Poller.Alert.Ipmi.Sel',
                    implementsTask: 'Task.Base.Poller.Alert.Ipmi.Sel',
                    options: {},
                    properties: {}
                }
            },
            {
                label: 'snmp-alert',
                taskDefinition: {
                    friendlyName: 'SNMP alerter',
                    injectableName: 'Task.Inline.Poller.Alert.Snmp',
                    implementsTask: 'Task.Base.Poller.Alert.Snmp',
                    options: {},
                    properties: {}
                }
            },
            {
                label: 'poller-cache',
                taskDefinition: {
                    friendlyName: 'Poller cache',
                    injectableName: 'Task.Inline.Poller.Cache',
                    implementsTask: 'Task.Base.Message.Cache',
                    options: {},
                    properties: {}
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
