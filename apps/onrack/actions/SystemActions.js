'use strict';

import SystemsStore from '../stores/SystemsStore';

import SystemResetTypesStore from '../stores/SystemResetTypesStore';

import SystemBootImagesStore from '../stores/SystemBootImagesStore';

const systems = new SystemsStore();

const systemResetActions = new SystemResetTypesStore();

const systemBootImages = new SystemBootImagesStore();

export default {

  systems,

  systemResetActions,

  systemBootImages

};
