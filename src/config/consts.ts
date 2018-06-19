export const CONSTS = {
  taskResult: {
    finished: 'finished',
    succeeded: 'succeeded',
    failed: 'failed',
    cancelled: 'cancelled',
    running: 'running',
    timeout: 'timeout'
  },
  waitOn: {
    finished: 'finished',
    succeeded: 'succeeded',
    failed: 'failed'
  },
  outputSlots: {
    failed: 0,
    succeeded: 1,
    finished: 2
  },
  // referenced from clarity alerts
  // color: node header and font color
  // bgcolor: background color
  colors: {
    error: {color: '#e06851', bgColor: '#c92100'},
    failed: {color: '#dfbda3', bgColor: '#c25400'},
    succeeded: {color: '#caf0a5', bgColor: '#62a420'},
    finished: {color: '#8fcbe9', bgColor: '#007cbb'},
    pending: {color: '#e0e0e0', bgColor: ''},
    running: {color: '#0000FF', bgColor: '#00FFFF'},
    cancelled: {color: '#DC143C', bgColor: '#9932CC'},
    timeout: {color: '#ADFF2F', bgColor: '#DAA520'}
  }
}
