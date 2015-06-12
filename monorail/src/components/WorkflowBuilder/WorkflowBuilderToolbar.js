'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
/* eslint-enable no-unused-vars */

import {
    Toolbar,
    ToolbarGroup,
    ToolbarTitle,
    DropDownIcon,
    FontIcon,
    ToolbarSeparator,
    RaisedButton
  } from 'material-ui';
import WorkflowsFileMenu from './WorkflowsFileMenu';

@mixin.decorate(RouteHelpers)
export default class WorkflowBuilderToolbar extends Component {

  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  render() {
    var iconMenuItems = [
      { payload: '1', text: 'Download' },
      { payload: '2', text: 'More Info' }
    ];
    return (
      <Toolbar className="WorkflowsBuilderToolbar">
        <ToolbarGroup key={0} float="left">
          <WorkflowsFileMenu />
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right" style={{paddingRight: '18%'}}>
          <ToolbarTitle text="Options" />
          <FontIcon className="fa fa-sort" />
          <DropDownIcon iconClassName="fa fa-angle-down" menuItems={iconMenuItems} />
          <ToolbarSeparator />
          <RaisedButton label="Create Broadcast" primary={true} />
        </ToolbarGroup>
      </Toolbar>
    );
  }

}
