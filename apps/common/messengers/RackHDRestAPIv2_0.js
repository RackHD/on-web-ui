// Copyright 2015, EMC, Inc.

'use strict';

import config from '../config/index';

import Swagger from 'swagger-client';

const API = 'http' +
  (config.check('Enable_RackHD_SSL') ? 's' : '') + '://' +
  config.RackHD_API;

const TOKEN = config.check('Enable_RackHD_API_Auth') ?
  config.RackHD_API_Auth_Token : '';

let authorizations = {};

if (config.check('Enable_RackHD_API_Auth')) {
  authorizations['Authentication-Token'] =
    new Swagger.ApiKeyAuthorization('Authorization', 'JWT ' + TOKEN, 'header');
}

let swaggerPromise = new Swagger({
  usePromise: true,
  authorizations : authorizations,
  // success: () => console.log('RackHD 2.0 Rest API is ready.'),
  url: API + '/swagger'
});

module.exports = new Promise((resolve, reject) => {
  swaggerPromise.catch(reject).then(swaggerClient => {
    let api2_0 = swaggerClient['/api/2.0'];
    Object.defineProperty(api2_0, 'swagger', {value: swaggerClient});
    resolve(api2_0);
  });
});
