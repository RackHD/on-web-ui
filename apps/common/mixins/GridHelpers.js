'use strict';

import {
    Toolbar,
    ToolbarGroup
  } from 'material-ui';

import Griddle from 'griddle-react';

export default {

  renderGridToolbar(params) {
    if (!params || !params.label) {
      return 'Unabled to render grid toolbar.';
    }
    if (params.count || params.count === 0) {
      params.count = <span>({params.count})</span>;
    }
    var rightToolbar = null;
    if (params.right) {
      rightToolbar = (
        <ToolbarGroup key={1} float="right">
          {params.right}
        </ToolbarGroup>
      );
    }
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <h4>{params.label} &nbsp; {params.count}</h4>
        </ToolbarGroup>
        {rightToolbar}
      </Toolbar>
    );
  },

  renderGrid(props, mapper, empty='No results.') {
    if (!props || !props.results || !props.results.length) {
      return <div className="empty center">{empty}</div>;
    }
    if (mapper) {
      props.results = props.results.map(mapper);
    }
    return <Griddle {...props} />;
  }

};
