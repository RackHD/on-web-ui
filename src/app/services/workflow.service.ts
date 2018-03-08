import { Injectable } from '@angular/core';
import { Event } from "typescript.events";
import { CONSTS } from '../consts';

import * as uuid from 'uuid/v4';
import * as _ from 'lodash';

@Injectable()
export class WorkflowService {

    getInitWorkflow(){
      return {
        "friendlyName": "",
        "injectableName": "",
        "tasks": [
          {
            "label": "new-task-1517998797597",
            "taskName": "Task.noop"
          },
          {
            "label": "new-task-1517998797390",
            "taskName": "Task.noop",
            "waitOn": {
              "new-task-1517998797597": "failed"
            }
          },
          {
            "label": "new-task-1517998797118",
            "taskName": "Task.noop"
          },
          {
            "label": "new-task-1517998796910",
            "taskName": "Task.noop"
          }
        ]
      }
    }

    // just mock here, should be replaced in actural
    getTaskTemplateByType(taskType: string){
        return {
          "label": "new-task-" + uuid().substr(0,10),
          "taskDefinition": {
            "friendlyName": taskType,
            "injectableName": taskType,
            "implementsTask": taskType,
            "options": {
              "profile": "boot-livecd.ipxe",
              "version": "livecd",
              "repo": "{{file.server}}/LiveCD/{{options.version}}"
            },
            "properties": {
              "os": {
                "linux": {
                  "distribution": "livecd"
                }
              }
            }
          }
        }
    }

}

class WorkflowEvent extends Event {}
