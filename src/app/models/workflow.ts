/*
 This defines the data model of Node's workflow.
*/
import { Task } from './task';

export class Workflow {
    node: string;
    status: string;
    context: {};
    definition: string;
    domain: string;
    id: string;
    injectableName: string;
    instanceId: string;
    logContext: {};
    name: string;
    serviceGraph: string;
    tasks: Array<Task>;
}

export const WORKFLOW_URL = {
  getAllUrl: "/workflows",
  getByIdentifierUrl: "/workflows/",
}

export const HISTORY_WORKFLOW_STATUS = ["succeeded", "failed", "cancelled"];
