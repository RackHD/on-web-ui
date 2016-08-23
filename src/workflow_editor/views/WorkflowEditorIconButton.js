// Copyright 2016, EMC, Inc.

import React from 'react';

import {
    FontIcon,
    IconButton
  } from 'material-ui';

export default function WorkflowEditorIconButton (props) {
  let emcTheme = props.muiTheme;
  let capitalize = (word) => word ? word.charAt(0).toUpperCase() + word.slice(1) : '';
  return (
    <IconButton
        tooltip={props.tooltip}
        style={{float: props.float, ['margin' + capitalize(props.float)]: props.margin || 16}}
        onClick={props.onClick}>
      <FontIcon
          className={'fa fa-' + props.icon}
          color={props.color || emcTheme.rawTheme.palette.alternateTextColor}
          hoverColor={props.hoverColor || emcTheme.rawTheme.palette.textColor} />
    </IconButton>
  );
}
