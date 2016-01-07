// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class SchemasRestAPI extends RestAPI {

  entity = 'schemas';

  unsupportedMethods = ['post', 'put', 'patch', 'delete'];

}
