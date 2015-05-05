'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars
import mixin from 'react-mixin'; // eslint-disable-line no-unused-vars

// import {
//     TextField,
//     FlatButton,
//     RaisedButton
//  } from 'material-ui';

import FormatHelpers from '../mixins/FormatHelpers'; // eslint-disable-line no-unused-vars
// import WorkflowActions from '../../actions/WorkflowActions';
// import JsonEditor from '../JsonEditor';

@mixin.decorate(FormatHelpers)
export default class CreateWorkflow extends Component {

  state = {
    workflow: null,
    disabled: false
  };

  render() {
    return (
      <div className="CreateWorkflow container">
        Hello World
      </div>
    );
  }

}
