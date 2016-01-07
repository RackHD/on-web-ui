# RackHD API Client

Copyright 2015, EMC, Inc.

    var RackHD = require('rackhd-client');

    var client = RackHD.v1_1.create('http://localhost:9090/api/1.1/');

    client.nodes.list()
      .then(nodes => { console.log(nodes); })
      .catch(err => { throw err; });
