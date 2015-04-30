'use strict';

import ActionTypes from '../constants/ActionTypes';
import Dispatcher from '../core/Dispatcher';
import { canUseDOM } from 'react/lib/ExecutionEnvironment';

export default {

  navigateTo(path, replaceState) {
    if (canUseDOM) {
      if (replaceState) {
        window.history.replaceState({}, document.title, path);
      } else {
        window.history.pushState({}, document.title, path);
      }
    }

    Dispatcher.handleViewAction({
      actionType: ActionTypes.CHANGE_LOCATION,
      path
    });
  },

  loadPage() {
    return new Promise(function (resolve) {
      // TODO:
      resolve();
    });
  }

};
