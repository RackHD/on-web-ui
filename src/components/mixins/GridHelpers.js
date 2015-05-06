'use strict';

import {
    Toolbar,
    ToolbarGroup
  } from 'material-ui';

import Griddle from 'griddle-react';

export default {

  renderGridToolbar: function (params) {
    if (!params || !params.label) {
      return 'Unabled to render grid toolbar.';
    }
    if (params.count) {
      params.count = <span>({params.count})</span>;
    }
    var rightToolbar = null;
    if (params.createButton) {
      rightToolbar = (
        <ToolbarGroup key={1} float="right">
          <span className="mui-toolbar-separator">&nbsp;</span>
          {params.createButton}
        </ToolbarGroup>
      );
    }
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <h4 style={{display: 'inline-block'}}>
            &nbsp; {params.label} &nbsp;
            {params.count}
          </h4>
        </ToolbarGroup>
        {rightToolbar}
      </Toolbar>
    );
  },

  renderGrid: function (props, mapper, empty) {
    if (!props || !props.results || !props.results.length) {
      return (
        <div className="empty center">
          {empty || 'No results.'}
        </div>
      );
    }
    if (mapper) {
      props.results = props.results.map(mapper);
    }
    return <Griddle {...props} />;
  }

};
