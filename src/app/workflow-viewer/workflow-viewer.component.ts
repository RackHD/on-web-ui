import { AfterViewInit, Component, EventEmitter, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-workflow-viewer',
  templateUrl: './workflow-viewer.component.html',
  styleUrls: ['./workflow-viewer.component.css']
})
export class WorkflowViewerComponent implements OnInit, AfterViewInit {
  onWorkflowInput = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.workflow = _.cloneDeep(this.mockWorkflow);
    this.workflow.tasks = _.transform(this.workflow.tasks, (result, value, key) => {
      result.push(value);
    }, [])
    this.onWorkflowInput.emit(_.cloneDeep(this.workflow));
  }

  workflow: any;
  mockWorkflow = {
    "node": "5a7d140f667bfc01004f3ac6",
    "definition": {
      "friendlyName": "Discovery",
      "injectableName": "Graph.rancherDiscovery",
      "options": {
        "bootstrap-rancher": {
          "triggerGroup": "bootstrap"
        },
        "finish-bootstrap-trigger": {
          "triggerGroup": "bootstrap"
        },
        "skip-reboot-post-discovery": {
          "skipReboot": "true",
          "when": "{{options.skipReboot}}"
        },
        "target": "5a7d140f667bfc01004f3ac6",
        "shell-reboot": {
          "rebootCode": 1
        },
        "instanceId": "639dfce4-19f4-4006-9439-11da208fe8dc"
      },
      "tasks": [
        {
          "label": "bootstrap-rancher",
          "taskName": "Task.Linux.Bootstrap.Rancher"
        },
        {
          "label": "catalog-dmi",
          "taskName": "Task.Catalog.dmi"
        },
        {
          "label": "catalog-ohai",
          "taskName": "Task.Catalog.ohai",
          "waitOn": {
            "129233a6-6386-4737-8bd7-4618d4a85fae": [
              "finished"
            ]
          }
        },
        {
          "label": "catalog-bmc",
          "taskName": "Task.Catalog.bmc",
          "waitOn": {
            "5fdc0f44-d013-4490-991f-93fedba923c8": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "set-interfaces",
          "taskName": "Task.Set.Interfaces",
          "waitOn": {
            "201db7c0-27bb-4249-aa29-e4ce4036f1f4": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "catalog-lsall",
          "taskName": "Task.Catalog.lsall",
          "waitOn": {
            "d9de0952-8203-4005-a1a1-bf97233126e6": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "catalog-megaraid",
          "taskName": "Task.Catalog.megaraid",
          "waitOn": {
            "d5427e97-6c24-4be5-b89f-1822aef28467": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "catalog-smart",
          "taskName": "Task.Catalog.smart",
          "waitOn": {
            "9df129c3-aac4-415c-8d13-a8c5e1842143": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "catalog-driveid",
          "taskName": "Task.Catalog.Drive.Id",
          "waitOn": {
            "a7affe6f-1f15-4214-8aee-94b2606f5e4b": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "catalog-lldp",
          "taskName": "Task.Catalog.LLDP",
          "waitOn": {
            "6cce31ae-9478-40b4-adfe-6412d8670eb5": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "set-boot-pxe",
          "taskDefinition": {
            "friendlyName": "Set PXE boot",
            "injectableName": "Task.Node.PxeBoot",
            "implementsTask": "Task.Base.Linux.Commands",
            "options": {
              "commands": "sudo ipmitool chassis bootdev pxe"
            },
            "properties": {
              "commands": {},
              "catalog": {
                "type": "dmi"
              },
              "os": {
                "linux": {
                  "type": "microkernel",
                  "distribution": "rancher",
                  "release": "1.0.2",
                  "Linux": "4.9.30"
                }
              }
            }
          },
          "waitOn": {
            "da070cef-20eb-447d-af76-f019debbf77a": [
              "finished"
            ]
          }
        },
        {
          "label": "skip-reboot-post-discovery",
          "taskName": "Task.Evaluate.Condition",
          "waitOn": {
            "23a067dd-6fb3-49b4-ac80-5e878ebb5d89": [
              "finished"
            ]
          },
          "ignoreFailure": true
        },
        {
          "label": "shell-reboot",
          "taskName": "Task.ProcShellReboot",
          "waitOn": {
            "89d710b7-b339-4fd6-bc02-d726ad7965cb": "failed"
          }
        },
        {
          "label": "noop",
          "taskName": "Task.noop",
          "waitOn": {
            "89d710b7-b339-4fd6-bc02-d726ad7965cb": "succeeded"
          }
        },
        {
          "label": "finish-bootstrap-trigger",
          "taskName": "Task.Trigger.Send.Finish",
          "waitOn": {
            "23a067dd-6fb3-49b4-ac80-5e878ebb5d89": [
              "finished"
            ]
          }
        },
        {
          "label": "node-discovered-alert",
          "taskName": "Task.Alert.Node.Discovered",
          "waitOn": {
            "0fe9c8b6-8556-40d0-93bc-cbdb1f9c1a79": [
              "finished"
            ]
          }
        }
      ]
    },
    "instanceId": "639dfce4-19f4-4006-9439-11da208fe8dc",
    "serviceGraph": null,
    "context": {
      "target": "5a7d140f667bfc01004f3ac6",
      "graphId": "639dfce4-19f4-4006-9439-11da208fe8dc",
      "graphName": "Graph.rancherDiscovery"
    },
    "domain": "default",
    "name": "Discovery",
    "injectableName": "Graph.rancherDiscovery",
    "tasks": {
      "23a067dd-6fb3-49b4-ac80-5e878ebb5d89": {
        "friendlyName": "Set PXE boot",
        "injectableName": "Task.Node.PxeBoot",
        "implementsTask": "Task.Base.Linux.Commands",
        "options": {
          "commands": "sudo ipmitool chassis bootdev pxe",
          "_taskTimeout": 86400000
        },
        "properties": {
          "commands": {},
          "catalog": {
            "type": "dmi"
          },
          "os": {
            "linux": {
              "type": "microkernel",
              "distribution": "rancher",
              "release": "1.0.2",
              "Linux": "4.9.30"
            }
          }
        },
        "instanceId": "23a067dd-6fb3-49b4-ac80-5e878ebb5d89",
        "runJob": "Job.Linux.Commands",
        "jobOptionsSchema": "linux-command.json",
        "label": "set-boot-pxe",
        "name": "Task.Node.PxeBoot",
        "waitingOn": {
          "da070cef-20eb-447d-af76-f019debbf77a": [
            "finished"
          ]
        },
        "ignoreFailure": false,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:24:17.164Z",
        "taskEndTime": "2018-02-09T03:24:22.300Z"
      },
      "648da36f-fbd5-4bcb-aa2f-d4886134014a": {
        "friendlyName": "Bootstrap Rancher",
        "injectableName": "Task.Linux.Bootstrap.Rancher",
        "implementsTask": "Task.Base.Linux.Bootstrap",
        "options": {
          "kernelFile": "vmlinuz-1.0.2-rancher",
          "initrdFile": "initrd-1.0.2-rancher",
          "kernelUri": "http://172.31.128.2:9090/common/vmlinuz-1.0.2-rancher",
          "initrdUri": "http://172.31.128.2:9090/common/initrd-1.0.2-rancher",
          "profile": "rancherOS.ipxe",
          "comport": "ttyS0",
          "triggerGroup": "bootstrap",
          "_taskTimeout": 86400000
        },
        "properties": {
          "os": {
            "linux": {
              "distribution": "rancher",
              "release": "1.0.2",
              "Linux": "4.9.30",
              "type": "microkernel"
            }
          }
        },
        "instanceId": "648da36f-fbd5-4bcb-aa2f-d4886134014a",
        "runJob": "Job.Linux.Bootstrap",
        "jobOptionsSchema": null,
        "label": "bootstrap-rancher",
        "name": "Task.Linux.Bootstrap.Rancher",
        "waitingOn": {},
        "ignoreFailure": false,
        "state": "succeeded",
        "terminalOnStates": [
          "succeeded",
          "timeout",
          "cancelled",
          "failed"
        ],
        "taskStartTime": "2018-02-09T03:22:56.134Z",
        "taskEndTime": "2018-02-09T03:24:22.428Z"
      },
      "d5427e97-6c24-4be5-b89f-1822aef28467": {
        "friendlyName": "Catalog lsall",
        "injectableName": "Task.Catalog.lsall",
        "implementsTask": "Task.Base.Linux.Catalog",
        "options": {
          "commands": [
            "sudo lspci -nn -vmm",
            "sudo lshw -json",
            "sudo lsblk -o KNAME,TYPE,ROTA; echo BREAK; sudo lsscsi --size"
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "lsall"
          }
        },
        "instanceId": "d5427e97-6c24-4be5-b89f-1822aef28467",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-lsall",
        "name": "Task.Catalog.lsall",
        "waitingOn": {
          "d9de0952-8203-4005-a1a1-bf97233126e6": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:23:51.473Z",
        "taskEndTime": "2018-02-09T03:23:56.703Z"
      },
      "89d710b7-b339-4fd6-bc02-d726ad7965cb": {
        "friendlyName": "Evaluate Condition",
        "injectableName": "Task.Evaluate.Condition",
        "implementsTask": "Task.Base.Evaluate.Condition",
        "options": {
          "skipReboot": "true",
          "when": "true",
          "_taskTimeout": 86400000
        },
        "properties": {},
        "instanceId": "89d710b7-b339-4fd6-bc02-d726ad7965cb",
        "runJob": "Job.Evaluate.Condition",
        "jobOptionsSchema": {
          "properties": {
            "when": {
              "description": "The condition value that to be evaluated. Only string \"true\" means condition meets",
              "type": "string"
            }
          },
          "required": [
            "when"
          ]
        },
        "label": "skip-reboot-post-discovery",
        "name": "Task.Evaluate.Condition",
        "waitingOn": {
          "23a067dd-6fb3-49b4-ac80-5e878ebb5d89": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "succeeded",
        "terminalOnStates": [
          "timeout",
          "cancelled"
        ],
        "taskStartTime": "2018-02-09T03:24:22.346Z",
        "taskEndTime": "2018-02-09T03:24:22.388Z"
      },
      "129233a6-6386-4737-8bd7-4618d4a85fae": {
        "friendlyName": "Catalog dmi",
        "injectableName": "Task.Catalog.dmi",
        "implementsTask": "Task.Base.Linux.Catalog",
        "options": {
          "commands": [
            "sudo dmidecode"
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "dmi"
          }
        },
        "instanceId": "129233a6-6386-4737-8bd7-4618d4a85fae",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-dmi",
        "name": "Task.Catalog.dmi",
        "waitingOn": {},
        "ignoreFailure": false,
        "state": "finished",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:22:56.134Z",
        "taskEndTime": "2018-02-09T03:23:32.862Z"
      },
      "9df129c3-aac4-415c-8d13-a8c5e1842143": {
        "friendlyName": "Catalog megaraid",
        "injectableName": "Task.Catalog.megaraid",
        "implementsTask": "Task.Base.Linux.Catalog",
        "optionsSchema": "catalog-raid.json",
        "options": {
          "adapter": "0",
          "commands": [
            "sudo /opt/MegaRAID/storcli/storcli64 /c0 show all J",
            "sudo /opt/MegaRAID/storcli/storcli64 show ctrlcount J",
            "sudo /opt/MegaRAID/storcli/storcli64 /c0 /eall /sall show all J",
            "sudo /opt/MegaRAID/storcli/storcli64 /c0 /vall show all J"
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "megaraid"
          }
        },
        "instanceId": "9df129c3-aac4-415c-8d13-a8c5e1842143",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-megaraid",
        "name": "Task.Catalog.megaraid",
        "waitingOn": {
          "d5427e97-6c24-4be5-b89f-1822aef28467": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "failed",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:23:56.723Z",
        "error": "Error: Encountered a failure running remote commands\n    at /RackHD/on-tasks/lib/utils/job-utils/command-util.js:89:23\n    at tryCatcher (/RackHD/on-core/node_modules/bluebird/js/main/util.js:26:23)\n    at MappingPromiseArray._promiseFulfilled (/RackHD/on-core/node_modules/bluebird/js/main/map.js:56:38)\n    at MappingPromiseArray.init (/RackHD/on-core/node_modules/bluebird/js/main/promise_array.js:92:18)\n    at MappingPromiseArray.init (/RackHD/on-core/node_modules/bluebird/js/main/map.js:29:23)\n    at Async._drainQueue (/RackHD/on-core/node_modules/bluebird/js/main/async.js:128:12)\n    at Async._drainQueues (/RackHD/on-core/node_modules/bluebird/js/main/async.js:133:10)\n    at Immediate.Async.drainQueues [as _onImmediate] (/RackHD/on-core/node_modules/bluebird/js/main/async.js:15:14)\n    at processImmediate [as _immediateCallback] (timers.js:383:17)",
        "taskEndTime": "2018-02-09T03:24:01.745Z"
      },
      "ef495f57-f498-4d27-a5d3-a6a63dab8c09": {
        "friendlyName": "Reboot Node via proc",
        "injectableName": "Task.ProcShellReboot",
        "implementsTask": "Task.Base.ShellReboot",
        "options": {
          "rebootCode": 1,
          "_taskTimeout": 86400000
        },
        "properties": {
          "power": {}
        },
        "instanceId": "ef495f57-f498-4d27-a5d3-a6a63dab8c09",
        "runJob": "Job.Linux.ShellReboot",
        "jobOptionsSchema": null,
        "label": "shell-reboot",
        "name": "Task.ProcShellReboot",
        "waitingOn": {
          "89d710b7-b339-4fd6-bc02-d726ad7965cb": "failed"
        },
        "ignoreFailure": false,
        "state": "pending",
        "terminalOnStates": [
          "succeeded",
          "timeout",
          "cancelled",
          "failed"
        ]
      },
      "5fdc0f44-d013-4490-991f-93fedba923c8": {
        "friendlyName": "Catalog ohai",
        "injectableName": "Task.Catalog.ohai",
        "implementsTask": "Task.Base.Linux.Catalog",
        "options": {
          "commands": [
            "sudo ohai --directory /etc/ohai/plugins"
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "ohai"
          }
        },
        "instanceId": "5fdc0f44-d013-4490-991f-93fedba923c8",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-ohai",
        "name": "Task.Catalog.ohai",
        "waitingOn": {
          "129233a6-6386-4737-8bd7-4618d4a85fae": [
            "finished"
          ]
        },
        "ignoreFailure": false,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:23:32.883Z",
        "taskEndTime": "2018-02-09T03:23:38.395Z"
      },
      "a7affe6f-1f15-4214-8aee-94b2606f5e4b": {
        "friendlyName": "Catalog S.M.A.R.T",
        "injectableName": "Task.Catalog.smart",
        "implementsTask": "Task.Base.Linux.Catalog",
        "options": {
          "commands": [
            {
              "command": "sudo bash get_smart.sh",
              "downloadUrl": "http://172.31.128.2:9030/api/current/templates/get_smart.sh?nodeId=5a7d140f667bfc01004f3ac6"
            }
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "smart"
          }
        },
        "instanceId": "a7affe6f-1f15-4214-8aee-94b2606f5e4b",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-smart",
        "name": "Task.Catalog.smart",
        "waitingOn": {
          "9df129c3-aac4-415c-8d13-a8c5e1842143": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:24:01.763Z",
        "taskEndTime": "2018-02-09T03:24:06.920Z"
      },
      "11813121-9dd2-46f5-a377-41389d916320": {
        "friendlyName": "noop",
        "implementsTask": "Task.Base.noop",
        "injectableName": "Task.noop",
        "options": {
          "option1": 1,
          "option2": 2,
          "option3": 3,
          "delay": 0,
          "_taskTimeout": 86400000
        },
        "properties": {
          "noop": {
            "foo": "bar",
            "type": "null"
          }
        },
        "instanceId": "11813121-9dd2-46f5-a377-41389d916320",
        "runJob": "Job.noop",
        "jobOptionsSchema": {
          "properties": {
            "delay": {
              "description": "Specify the time span that this task will be finished after given time, in milliseconds",
              "type": "integer",
              "minimum": 0
            },
            "option1": {
              "description": "A placeholder testing option #1"
            },
            "option2": {
              "description": "A placeholder testing option #2"
            },
            "options3": {
              "description": "A placeholder testing option #3"
            }
          }
        },
        "label": "noop",
        "name": "Task.noop",
        "waitingOn": {
          "89d710b7-b339-4fd6-bc02-d726ad7965cb": "succeeded"
        },
        "ignoreFailure": false,
        "state": "succeeded",
        "terminalOnStates": [
          "succeeded",
          "timeout",
          "cancelled",
          "failed"
        ],
        "taskStartTime": "2018-02-09T03:24:22.449Z",
        "taskEndTime": "2018-02-09T03:24:22.500Z"
      },
      "201db7c0-27bb-4249-aa29-e4ce4036f1f4": {
        "friendlyName": "Catalog bmc",
        "injectableName": "Task.Catalog.bmc",
        "implementsTask": "Task.Base.Linux.Catalog",
        "options": {
          "commands": [
            {
              "command": "sudo ipmitool lan print",
              "acceptedResponseCodes": [
                1
              ]
            },
            "sudo ipmitool sel",
            "sudo ipmitool sel list -c",
            "sudo ipmitool mc info",
            {
              "command": "sudo ipmitool user summary 1",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 1",
              "acceptedResponseCodes": [
                1
              ]
            },
            "sudo ipmitool fru",
            {
              "command": "sudo ipmitool lan print 2",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 2",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 2",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 3",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 3",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 3",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 4",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 4",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 4",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 5",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 5",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 5",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 6",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 6",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 6",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 7",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 7",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 7",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 8",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 8",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 8",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 9",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 9",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 9",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 10",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 10",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 10",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 11",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 11",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 11",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 12",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 12",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 12",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 13",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 13",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 13",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 14",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 14",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 14",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool lan print 15",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool user summary 15",
              "acceptedResponseCodes": [
                1
              ]
            },
            {
              "command": "sudo ipmitool -c user list 15",
              "acceptedResponseCodes": [
                1
              ]
            }
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "bmc"
          }
        },
        "instanceId": "201db7c0-27bb-4249-aa29-e4ce4036f1f4",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-bmc",
        "name": "Task.Catalog.bmc",
        "waitingOn": {
          "5fdc0f44-d013-4490-991f-93fedba923c8": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:23:38.414Z",
        "taskEndTime": "2018-02-09T03:23:46.461Z"
      },
      "6cce31ae-9478-40b4-adfe-6412d8670eb5": {
        "friendlyName": "Catalog Drive IDs",
        "injectableName": "Task.Catalog.Drive.Id",
        "implementsTask": "Task.Base.Linux.Catalog",
        "options": {
          "commands": [
            {
              "command": "sudo node get_driveid.js",
              "downloadUrl": "http://172.31.128.2:9030/api/current/templates/get_driveid.js?nodeId=5a7d140f667bfc01004f3ac6"
            }
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "driveId"
          }
        },
        "instanceId": "6cce31ae-9478-40b4-adfe-6412d8670eb5",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-driveid",
        "name": "Task.Catalog.Drive.Id",
        "waitingOn": {
          "a7affe6f-1f15-4214-8aee-94b2606f5e4b": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:24:06.941Z",
        "taskEndTime": "2018-02-09T03:24:12.090Z"
      },
      "0fe9c8b6-8556-40d0-93bc-cbdb1f9c1a79": {
        "friendlyName": "Send Finish Trigger",
        "injectableName": "Task.Trigger.Send.Finish",
        "implementsTask": "Task.Base.Trigger",
        "options": {
          "triggerMode": "send",
          "triggerType": "finish",
          "triggerGroup": "bootstrap",
          "_taskTimeout": 86400000
        },
        "properties": {},
        "instanceId": "0fe9c8b6-8556-40d0-93bc-cbdb1f9c1a79",
        "runJob": "Job.Trigger",
        "jobOptionsSchema": null,
        "label": "finish-bootstrap-trigger",
        "name": "Task.Trigger.Send.Finish",
        "waitingOn": {
          "23a067dd-6fb3-49b4-ac80-5e878ebb5d89": [
            "finished"
          ]
        },
        "ignoreFailure": false,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:24:22.351Z",
        "taskEndTime": "2018-02-09T03:24:22.404Z"
      },
      "d9de0952-8203-4005-a1a1-bf97233126e6": {
        "friendlyName": "Set Interfaces",
        "injectableName": "Task.Set.Interfaces",
        "implementsTask": "Task.Base.Linux.Commands",
        "options": {
          "commands": [
            {
              "command": "sudo python set_interfaces.py",
              "downloadUrl": "http://172.31.128.2:9030/api/current/templates/set_interfaces.py?nodeId=5a7d140f667bfc01004f3ac6"
            }
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "os": {
            "linux": {
              "type": "microkernel"
            }
          },
          "commands": {}
        },
        "instanceId": "d9de0952-8203-4005-a1a1-bf97233126e6",
        "runJob": "Job.Linux.Commands",
        "jobOptionsSchema": "linux-command.json",
        "label": "set-interfaces",
        "name": "Task.Set.Interfaces",
        "waitingOn": {
          "201db7c0-27bb-4249-aa29-e4ce4036f1f4": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:23:46.476Z",
        "taskEndTime": "2018-02-09T03:23:51.454Z"
      },
      "da070cef-20eb-447d-af76-f019debbf77a": {
        "friendlyName": "Catalog LLDP",
        "injectableName": "Task.Catalog.LLDP",
        "implementsTask": "Task.Base.Linux.Catalog",
        "options": {
          "commands": [
            "sudo /usr/sbin/lldpcli show neighbor -f keyvalue"
          ],
          "_taskTimeout": 86400000
        },
        "properties": {
          "catalog": {
            "type": "lldp"
          }
        },
        "instanceId": "da070cef-20eb-447d-af76-f019debbf77a",
        "runJob": "Job.Linux.Catalog",
        "jobOptionsSchema": "linux-command.json",
        "label": "catalog-lldp",
        "name": "Task.Catalog.LLDP",
        "waitingOn": {
          "6cce31ae-9478-40b4-adfe-6412d8670eb5": [
            "finished"
          ]
        },
        "ignoreFailure": true,
        "state": "succeeded",
        "terminalOnStates": [],
        "taskStartTime": "2018-02-09T03:24:12.111Z",
        "taskEndTime": "2018-02-09T03:24:17.142Z"
      },
      "51175801-9f14-4c52-9765-2dec87e79ec4": {
        "friendlyName": "Node Discovered Alerts",
        "injectableName": "Task.Alert.Node.Discovered",
        "implementsTask": "Task.Base.Alert.Node.Discovered",
        "options": {
          "_taskTimeout": 86400000
        },
        "properties": {},
        "instanceId": "51175801-9f14-4c52-9765-2dec87e79ec4",
        "runJob": "Job.Alert.Node.Discovered",
        "jobOptionsSchema": null,
        "label": "node-discovered-alert",
        "name": "Task.Alert.Node.Discovered",
        "waitingOn": {
          "0fe9c8b6-8556-40d0-93bc-cbdb1f9c1a79": [
            "finished"
          ]
        },
        "ignoreFailure": false,
        "state": "succeeded",
        "terminalOnStates": [
          "succeeded",
          "timeout",
          "cancelled",
          "failed"
        ],
        "taskStartTime": "2018-02-09T03:24:22.449Z",
        "taskEndTime": "2018-02-09T03:24:22.535Z"
      }
    },
    "_status": "succeeded",
    "logContext": {
      "graphInstance": "639dfce4-19f4-4006-9439-11da208fe8dc",
      "graphName": "Discovery",
      "id": "5a7d140f667bfc01004f3ac6"
    },
    "parentGraphId": "caa47389-ee3c-4df7-bee5-8b438f789b36",
    "parentTaskId": "e4a7f3b8-4dfe-4e08-af4f-745f5c53a633",
    "updatedAt": "2018-02-09T03:24:22.535Z",
    "createdAt": "2018-02-09T03:22:56.085Z",
    "id": "5a7d1410f0434626270aaa6f"
  };
}
