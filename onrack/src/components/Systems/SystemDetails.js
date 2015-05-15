'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import PageHelpers from '../../../../common/mixins/PageHelpers';
/* eslint-enable no-unused-vars */

import {} from 'material-ui';
import { systems } from '../../actions/SystemActions';

@mixin.decorate(PageHelpers)
export default class SystemDetails extends Component {

  state = {system: null};

  componentDidMount() {
    this.unwatchSystem = systems.watchOne(this.getSystemId(), 'system', this);
    this.readNode();
  }

  componentWillUnmount() { this.unwatchSystem(); }

  render() {
    return (
      <div className="SystemDetails">
        {this.renderBreadcrumbs(
          {href: 'dash', label: 'Dashboard'},
          {href: 'systems', label: 'System'},
          this.getSystemId()
        )}
        {JSON.stringify(this.state.system)}
      </div>
    );
  }

  getSystemId() { return this.props.params.systemId; }

  readNode() { systems.read(this.getSystemId()); }

}
