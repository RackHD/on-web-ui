// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class CatalogsRestAPI extends RestAPI {

  entity = 'catalogs';

  unsupportedMethods = ['post', 'put', 'patch', 'delete'];

}
