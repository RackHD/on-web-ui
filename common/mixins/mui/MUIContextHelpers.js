'use strict';

import { PropTypes } from 'react';
import { Styles } from 'material-ui';

const themeManager = new Styles.ThemeManager();

export default {

  get themeManager() {
    this._themeManager = this._themeManager || themeManager;
    return this._themeManager;
  },

  newThemeManager() {
    this._themeManager = new Styles.ThemeManager();
    return this._themeManager;
  },

  muiContextTypes(contextTypes) {
    contextTypes = contextTypes || {};
    contextTypes.muiTheme = contextTypes.muiTheme || PropTypes.object;
    return contextTypes;
  },

  muiContext(context) {
    context = context || {};
    context.muiTheme = this.themeManager.getCurrentTheme() || context.muiTheme;
    return context;
  }

};
