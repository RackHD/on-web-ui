/*
 This defines the data model of Node's task.
*/
export class Task {
    lable: string;
    instanceId: string;
    options?: {};
    runJob: string;
    state: string;
    taskStartTime: string;
    terminalOnStates: Array<String>;
    waitingOn: {};
}
