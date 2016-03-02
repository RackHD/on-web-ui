// Copyright 2015, EMC, Inc.

'use strict';

import config from '../config/index';

import RackHD from 'rackhd-client';

let api1_1 = RackHD.v1_1.create(config.MONORAIL_API);

module.exports = api1_1;
