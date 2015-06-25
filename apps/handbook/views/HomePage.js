/**
# Home Page

Documentation home page.
*/
'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';
import PageHelpers from 'common-web-ui/mixins/PageHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

/**
### Directory Structure SAMPLE
```
.
└── {app}
    ├── actions       # Actions modules delegate calls to stores.
    ├── api           # API requests for application data.
    ├── assets        # Static files to be made public.
    ├── lib           # Reusable JavaScript code.
    ├── mixins        # React component mixin definitions.
    ├── views         # React views.
    ├── stores        # Stores contain persisted application data.
    ├── less          # Less and CSS files.
    ├── templates     # HTML files.
    ├── bundle.js     # Main application entry point.
    └── config.js     # Client configuration file.
```
*/

import FileTreeBrowser from './FileTreeBrowser';
import FileManualViewer from './FileManualViewer';

@radium
@mixin.decorate(DeveloperHelpers)
@mixin.decorate(PageHelpers)
@mixin.decorate(RouteHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    style: PropTypes.any
  },

  defaultProps: {
    className: '',
    style: {}
  }
})
/**
@object
  @type class
  @extends React.Component
  @name HomePage
  @desc Home page component
*/
export default class HomePage extends Component {

  /**
  @method
    @name componentDidMount
    @desc Called once when the component is added.
  */
  componentDidMount() {}

  /**
  @method
    @name componentWillUnmount
    @desc Called once when the component is removed.
  */
  componentWillUnmount() {}

  /**
  @method
    @name render
    @desc Creates home page shadow dom.
  */
  render() {
    var file =
      this.props.params &&
      this.props.params.doc &&
      decodeURIComponent(this.props.params.doc) ||
      'README.md';

    return (
      <div className="HomePage ungrid">
        <div className="line">
          <div className="cell" style={{width: 276, paddingBottom: 20}}>
            <FileTreeBrowser
                ref="files"
                lazy={false}
                onSelect={this.selectFile.bind(this)} />
          </div>
          <div className="cell" style={{background: '#ddd'}}>
            <div style={{padding: '50px 10px 10px 10px'}}>
              <FileManualViewer
                  ref="viewer"
                  file={file} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
  @method
    @name selectFile
    @desc Switches which file the manual viewer is viewing.
  */
  selectFile(file) {
    this.routeTo('docs', encodeURIComponent(file));
  }

}
