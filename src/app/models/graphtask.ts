/*
 This defines the data model of  Graph Tasks
*/
export class GraphTask {
    friendlyName: string;
    injectableName: string;
    options: any;
    implementsTask: string;
    optionsSchema?: string;
    properties?: any;
}

export const GRAPHTASK_URL = {
    getAllUrl: '/workflows/tasks',
    getByIdentifierUrl: '/workflows/tasks/',
}
