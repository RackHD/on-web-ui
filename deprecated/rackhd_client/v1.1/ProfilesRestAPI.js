// Copyright 2015, EMC, Inc.

import RestAPI from '../lib/RestAPI';

export default class ProfilesRestAPI extends RestAPI {

  entity = 'profiles/library';

  unsupportedMethods = ['post', 'patch', 'delete'];

}
