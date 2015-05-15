'use strict';

import SystemsStore from '../stores/SystemsStore';

import SystemResetTypesStore from '../stores/SystemResetTypesStore';

import SystemBootImagesStore from '../stores/SystemBootImagesStore';

const systems = new SystemsStore();

const systemResetTypes = new SystemResetTypesStore();

const systemBootImages = new SystemBootImagesStore();

export default {

  systems,

  systemResetTypes,

  systemBootImages

};
