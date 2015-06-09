'use strict';

export default {
  bounds: [0, 0, 500, 500],
  cache: {
    nodes: [
      {
        bounds: [20, 20, 100, 100],
        layer: 0,
        scale: 1,
        ports: [
          {name: 'lala', sockets: [
            {id: 'S1', type: 'in'},
            {id: 'S2', type: 'out'}
          ]},
          {name: 'foofoo', sockets: [
            {id: 'S3', type: 'in'},
            {id: 'S4', type: 'out'}
          ]}
        ]
      },
      {
        bounds: [420, 420, 500, 500],
        layer: 1,
        scale: 1,
        ports: [
          {name: 'state', sockets: [
            {id: 'S5', type: 'failure', dir: [0, 1]},
            {id: 'S6', type: 'success', dir: [0, 1]},
            {id: 'S7', type: 'complete', dir: [0, 1]}
          ]},
          {name: 'action', sockets: [
            {id: 'S8', type: 'apply', dir: [0, 1]}
          ]}
        ]
      }
    ],
    links: [
      {
        layer: 0,
        scale: 1,
        socketOut: 'S2',
        socketIn: 'S3'
      },
      {
        layer: 0,
        scale: 1,
        socketOut: 'S7',
        socketIn: 'S8'
      }
    ]
  }
};
