'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars

class Navbar {

  render() {
    return (
      <div className="navbar-top" role="navigation">
        <div className="container">
          <a className="navbar-brand row" href="/">
            <img src={require('./logo-small.png')} width="38" height="38" alt="React" />
            <span>OnRack Web UI</span>
          </a>
        </div>
      </div>
    );
  }

}

export default Navbar;
