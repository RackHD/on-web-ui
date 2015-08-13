'use strict';

import { Component, mixin } from 'mach-react';

import colors from '../config/colors';

let defaultStyles = {
  root: {},

  header: {
    background: colors.emc.mediumGrey.hexString(),
    color: colors.emc.offWhite.hexString()
  },

  content: {
    color: colors.emc.black.hexString(),
    background: colors.emc.white.hexString(),
    padding: '64px 0 0 0'
  },

  footer: {
    color: colors.emc.offWhite.hexString(),
    background: colors.emc.darkGrey.hexString(),
    padding: '10px'
  }
};

export default class HomeView extends Component {

  props = this.assignObject(this.props || {}, {
    styles: {}
  });

  state = {};

  render(React) {
    console.log(this.props.children);
    var styles = this.props.styles,
        header = this.props.header,
        footer = this.props.footer;

    if (header === undefined) {
      header = <div
          className="header"
          style={[defaultStyles.header, styles.header]}>
        Header
      </div>;
    }

    if (footer === undefined) {
      footer = <div
          className="footer"
          style={[defaultStyles.footer, styles.footer]}>
        Footer
      </div>;
    }

    let isEmpty = !this.props.children || !this.props.children.length;

    return (
      <div
          className={this.props.className}
          style={[defaultStyles.root, styles.root]}>
        <div>
          {header}
          <div
              className="content"
              style={[defaultStyles.content, styles.content]}>
            {isEmpty ? 'Not Found' : this.props.children}
          </div>
          {footer}
        </div>
      </div>
    );
  }

}
