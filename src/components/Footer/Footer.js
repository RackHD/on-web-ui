'use strict';

import './Footer.less';
import React from 'react'; // eslint-disable-line no-unused-vars

class Footer {

  render() {
    return (
      <div className="navbar-footer">
        <div className="container">
          <p className="text-muted">
            <span>© EMC</span>
            {this.props.children}
          </p>
        </div>
      </div>
    );
  }

}

export default Footer;
