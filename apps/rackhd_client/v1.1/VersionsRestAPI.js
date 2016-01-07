// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class VersionsRestAPI extends RestAPI {

  entity = 'versions';

  unsupportedMethods = ['list', 'post', 'patch', 'put', 'delete'];

  get() {
    return super.get('');
  }

}
