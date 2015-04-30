'use strict';
import './NodesPage.less';
import React, { PropTypes } from 'react'; // eslint-disable-line no-unused-vars

class HomePage {

  static propTypes = {
    body: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="ContentPage"
        dangerouslySetInnerHTML={{__html: this.props.body}} />
    );
  }

}

export default NodesPage;
