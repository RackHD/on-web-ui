'use strict';

import Color from 'color';

import muiColors from 'material-ui/lib/styles/colors';
import ThemeManager from 'material-ui/lib/styles/theme-manager';

import emcColors from './emcColors';

let muiTheme = ThemeManager.getMuiTheme({
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
    desktopToolbarHeight: 56,
  },

  fontFamily: 'Roboto, sans-serif',

  palette: {
    primary1Color: muiColors.lightBlueA200,
    primary2Color: muiColors.lightBlueA700,
    primary3Color: emcColors.mediumGrey,
    accent1Color: muiColors.blueA200,
    accent2Color: emcColors.emcBlue,
    accent3Color: muiColors.indigoA200,
    textColor: emcColors.offWhite,
    alternateTextColor: emcColors.lightGrey,
    canvasColor: emcColors.darkGrey,
    borderColor: new Color(emcColors.lightGrey).darken(0.3).hexString(),
    disabledColor: new Color(emcColors.lightGrey).darken(0.3).hexString(),
  }
});

muiTheme.snackbar.textColor = muiColors.black;

muiTheme.tableRow.stripeColor =
  new Color(emcColors.darkGrey).lighten(0.3).hexString();

muiTheme.tableRow.borderColor =
  new Color(emcColors.darkGrey).lighten(0.6).hexString();

export default muiTheme;
