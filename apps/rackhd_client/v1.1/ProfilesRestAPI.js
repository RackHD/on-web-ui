// Copyright 2015, EMC, Inc.

'use strict';

import RestAPI from '../lib/RestAPI';

export default class ProfilesRestAPI extends RestAPI {

  entity = 'profiles/library';

  unsupportedMethods = ['post', 'patch', 'delete'];

}
