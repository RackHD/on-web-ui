// Copyright 2015, EMC, Inc.

import merge from 'lodash/merge';
import Color from 'color';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import * as muiColors from 'material-ui/styles/colors';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import emcColors from './emcColors';

let muiTheme = getMuiTheme(merge(darkBaseTheme, {
  spacing: {
    iconSize: 24,

    desktopGutter: 24,
    desktopGutterMore: 32,
    desktopGutterLess: 16,
    desktopGutterMini: 8,
    desktopKeylineIncrement: 64,
    desktopDropDownMenuItemHeight: 32,
    desktopDropDownMenuFontSize: 15,
    desktopLeftNavMenuItemHeight: 48,
    desktopSubheaderHeight: 48,
    desktopToolbarHeight: 56
  },

  fontFamily: 'Roboto, sans-serif',

  palette: {
    primary1Color: new Color(emcColors.emcBlue).hexString(),
    primary2Color: new Color(emcColors.emcBlue).darken(0.1).hexString(),
    primary3Color: new Color(emcColors.emcBlue).darken(0.2).hexString(),
    accent1Color: new Color(emcColors.emcBlue).lighten(0.2).hexString(),
    accent2Color: new Color(emcColors.emcBlue).lighten(0.1).hexString(),
    accent3Color: new Color(emcColors.emcBlue).hexString(),
    textColor: new Color(emcColors.offWhite).hexString(),
    alternateTextColor: new Color(emcColors.offWhite).lighten(0.1).hexString(),
    canvasColor: new Color(emcColors.darkGrey).hexString(),
    borderColor: new Color(emcColors.mediumGrey).hexString(),
    disabledColor: new Color(emcColors.lightGrey).hexString()
  },

  zIndex: {
    layer: 20,
    popover: 20
  }
}));

muiTheme.emcColors = emcColors;

muiTheme.darkEMC = true;

muiTheme.snackbar.textColor = muiColors.black;

muiTheme.tableRow.stripeColor =
  new Color(emcColors.darkGrey).lighten(0.4).hexString();

muiTheme.tableRow.borderColor =
  new Color(emcColors.darkGrey).lighten(0.8).hexString();

muiTheme.flatButton.color =
muiTheme.raisedButton.color =
  new Color(emcColors.mediumGrey).lighten(0.8).hexString();

muiTheme.flatButton.textColor =
muiTheme.raisedButton.textColor =
  new Color(emcColors.offWhite).hexString();

muiTheme.raisedButton.disabledColor =
  new Color(emcColors.mediumGrey).lighten(0.4).hexString();

muiTheme.flatButton.disabledTextColor =
muiTheme.raisedButton.disabledTextColor =
  new Color(emcColors.mediumGrey).lighten(0.8).hexString();

export default muiTheme;
