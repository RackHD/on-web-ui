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
    pollers: '/pollers',
    pollersById: '/pollers/',
    data: '/data/current'
}