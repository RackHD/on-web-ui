// Copyright 2016, EMC, Inc.

import 'src-config';
import 'src-monorail/routes';

import './bootsrap';

global.isIntegrationTesting = true;

const src = require.context('../../test/specs', true, /-spec\.js$/);
src.keys().forEach(src);
