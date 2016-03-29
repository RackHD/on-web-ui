// Copyright 2015, EMC, Inc.

'use strict';

import { Client as ElasticsearchClient } from 'elasticsearch';

import config from '../config/index';

module.exports = new ElasticsearchClient({
  host: config.Elasticsearch_API,
  // log: 'trace'
});

module.exports.ping({
  // ping usually has a 3000ms timeout
  requestTimeout: Infinity
}, error => {
  if (error) {
    console.trace('elasticsearch cluster is down!');
  } else {
    console.log('All is well');
  }
});
