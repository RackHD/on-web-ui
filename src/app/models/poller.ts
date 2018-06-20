/*
 This defines the data model of Node's poller.
*/
export class Poller {
    id: string;
    type: string;
    pollInterval: number;
    node: string;
    config: {};
    lastStarted: string; // or Date
    lastFinished: string;
    paused: boolean;
    failureCount: number;
    latestData: string;
}

export const POLLER_URL = {
    getAllUrl: '/pollers',
    getByIdentifierUrl: '/pollers/',
    data: '/data/current'
}

export const POLLER_INTERVAL = [30000, 60000, 120000, 300000, 600000];
