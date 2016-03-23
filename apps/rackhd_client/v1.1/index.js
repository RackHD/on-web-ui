// Copyright 2015, EMC, Inc.

'use strict';

exports.MONORAIL_API_v1_1 = 'http://localhost:8080/api/1.1/';

exports.RestAPIs = {
  Catalogs: require('./CatalogsRestAPI'),
  Config: require('./ConfigRestAPI'),
  Files: require('./FilesRestAPI'),
  Lookups: require('./LookupsRestAPI'),
  Nodes: require('./NodesRestAPI'),
  OBMServices: require('./OBMServicesRestAPI'),
  Pollers: require('./PollersRestAPI'),
  Profiles: require('./ProfilesRestAPI'),
  Schemas: require('./SchemasRestAPI'),
  Skus: require('./SkusRestAPI'),
  Tasks: require('./TasksRestAPI'),
  Templates: require('./TemplatesRestAPI'),
  Versions: require('./VersionsRestAPI'),
  Workflows: require('./WorkflowsRestAPI')
};

exports.create = function RackHDv1_1API(url, auth) {
  const nameMap = {
    Catalogs: 'catalogs',
    Config: 'config',
    Files: 'files',
    Lookups: 'lookups',
    Nodes: 'nodes',
    OBMServices: 'obms',
    Pollers: 'pollers',
    Profiles: 'profiles',
    Schemas: 'schemas',
    Skus: 'skus',
    Tasks: 'tasks',
    Templates: 'templates',
    Versions: 'versions',
    Workflows: 'workflows'
  };

  let api = {
    url: url,
    auth: auth
  };

  Object.keys(exports.RestAPIs).forEach(apiName => {
    let RestAPI = exports.RestAPIs[apiName],
        name = nameMap[apiName] || apiName.toLowerCase();

    api[name] = new RestAPI(url, auth);
  });

  return api;
};
