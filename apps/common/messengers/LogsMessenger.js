// Copyright 2015, EMC, Inc.

'use strict';

import url from 'url';
import config from '../config/index';

import Messenger from 'rui-common/lib/Messenger';

export default class WorkflowLogsMessenger extends Messenger {
  handlers = ['item'];

  constructor(host, secure) {
    console.log(config);
    let api = url.parse(config.MONORAIL_API);
    super('mq', host || api.host, secure || api.protocol === 'https:');
  }

  item(msg) {
    if (this.handler) this.handler(msg);
  }

  listen(handler) {
    this.ignore();
    setTimeout(() => {
      this.handler = handler;
      this.watch({
        exchange: 'on.logging',
        routingKey: '#'
      });
    }, 100);
  }

  ignore() {
    this.stop({
      exchange: 'on.logging',
      routingKey: '#'
    });
  }
}
