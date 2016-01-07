// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class TemplatesRestAPI extends RestAPI {

  entity = 'templates/library';

  unsupportedMethods = ['post', 'patch', 'delete'];

}
