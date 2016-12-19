// Copyright 2015, EMC, Inc.

import RestAPI from '../lib/RestAPI';

export default class SchemasRestAPI extends RestAPI {

  entity = 'schemas';

  unsupportedMethods = ['post', 'put', 'patch', 'delete'];

}
