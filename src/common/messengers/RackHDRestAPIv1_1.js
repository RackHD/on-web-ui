// Copyright 2015, EMC, Inc.

import config from 'src-config';

import RackHD from 'src-rackhd-client';

const API = 'http' +
  (config.check('Enable_RackHD_SSL') ? 's' : '') + '://' +
  config.MonoRail_API;

const TOKEN = config.check('Enable_RackHD_API_Auth') ?
  config.RackHD_API_Auth_Token : '';

let api1_1 = RackHD.v1_1.create(API, TOKEN);

module.exports = api1_1;
