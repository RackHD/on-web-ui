// Copyright 2015, EMC, Inc.

import RestAPI from '../lib/RestAPI';

export default class TemplatesRestAPI extends RestAPI {

  entity = 'templates/library';

  unsupportedMethods = ['post', 'patch', 'delete'];

}
