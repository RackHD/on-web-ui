/*
 This defines the data model of Workflow Metadata.
*/
export class Graph {
    friendlyName: string;
    injectableName: string;
    tasks: any;
    options: any;
}

export const GRAPH_URL = {
    getAllUrl: '/workflows/graphs',
    getByIdentifierUrl: '/workflows/graphs/',
}
