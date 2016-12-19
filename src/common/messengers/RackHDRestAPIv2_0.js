// Copyright 2015, EMC, Inc.

import config from 'src-config';

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
  authorizations,
  usePromise: true,
  url: API + '/swagger'
});

module.exports = new Promise((resolve, reject) => {
  let done = false;

  const finish = (api2_0) => {
    if (done) return;
    done = true;
    if (!api2_0) {
      let err = new Error('Failed to load RackHD API 2.0');
      console.error(err);
      return reject(err);
    }
    console.log('RackHD API 2.0 is ready.'),
    module.exports.api = api2_0;
    resolve(api2_0);
  };

  const failed = () => finish();

  setTimeout(failed, 5000);

  swaggerPromise.catch(failed).then(swaggerClient => {
    let api2_0 = swaggerClient['/api/2.0'];
    Object.defineProperty(api2_0, 'swagger', {value: swaggerClient});
    finish(api2_0);
  });
});

module.exports.url = API;
