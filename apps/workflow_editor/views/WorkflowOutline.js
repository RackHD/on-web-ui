'use strict';

import React, { // eslint-disable-line no-unused-vars
  Component, PropTypes } from 'react';

import radium from 'radium';
import mixin from 'react-mixin';
import decorate from 'common-web-ui/lib/decorate';

import DeveloperHelpers from 'common-web-ui/mixins/DeveloperHelpers';

import JsonInspector from 'react-json-inspector';
import InteractiveSelection from 'react-json-inspector/example/interactive-selection';
let InteractiveSelectionFactory = React.createFactory(InteractiveSelection);

import {
    List,
    ListItem,
    FontIcon,
    IconButton,
    // TextField,
    Checkbox
  } from 'material-ui';

import WETaskOutline from './TaskOutline';

/**
# WEWorkflowJSON

@object
  @type class
  @extends React.Component
  @name WEWorkflowJSON
  @desc
*/

@radium
@mixin.decorate(DeveloperHelpers)
@decorate({
  propTypes: {
    className: PropTypes.string,
    model: PropTypes.object,
    style: PropTypes.any
  },

  defaultProps: {
    className: 'WorkflowOutline',
    model: null,
    style: {}
  },

  contextTypes: {
    layout: PropTypes.any,
    editor: PropTypes.any
  }
})
export default class WEWorkflowOutline extends Component {

  state = {
    model: this.props.model/*,
    selected: []*/
  };

  componentWillMount() {}

  componentWillUnmount() {}

  // componentWillReceiveProps(nextProps) {
  //   this.setState({model: nextProps.model});
  // }

  componentDidUpdate() {
    if (this.state.model && this.state.model._) {
      this.state.model._.outlineComponent = this;
    }
  }

  updateSelected(selected) {
    // this.setState({ selected });
    // debugger;
    let isChecked = selected.indexOf(this.state.model._.groupComponent) !== -1;
    this.refs.selected.setChecked(isChecked);
    Object.keys(this.refs).forEach(key => {
      if (key.indexOf('task-') === 0) {
        console.log(this.refs[key]);
        this.refs[key].updateSelected(selected);
      }
    });
  }

  render() {
    // console.log('RENDER WORKFLOW OUTLINE', this.state);
    let workflow = this.state.model;

    // let optionsMapper = (object, list, hash) => {
    //   if (!object || typeof object !== 'object') {
    //     return null;
    //   }
    //   hash = hash || '';
    //   Object.keys(object).forEach(key => {
    //     let value = object[key];
    //     let subOptions = optionsMapper(value, [], hash + key + '-');
    //     list.push(
    //       <ListItem key={hash + key} ref={hash + key}
    //           primaryText={subOptions && [
    //             <TextField
    //                 onTouchTap={this.stopEvent}
    //                 floatingLabelText="Property Name"
    //                 value={key} />,
    //             <IconButton iconClassName="fa fa-remove" tooltip="Remove Property"/>
    //           ]}
    //           onTouchTap={subOptions && this.toggleListItem.bind(this, hash + key) || null}>
    //         {subOptions || [
    //           <TextField
    //               onTouchTap={this.stopEvent}
    //               floatingLabelText={key}
    //               value={value} />,
    //           <IconButton iconClassName="fa fa-remove" tooltip="Remove Property"/>
    //         ]}
    //       </ListItem>
    //     );
    //   });
    //   list.push(
    //     <ListItem key={hash + 'NEW'}
    //         primaryText={[
    //           <TextField
    //             onTouchTap={this.stopEvent}
    //             floatingLabelText="Property Name" />,
    //           <IconButton iconClassName="fa fa-plus" tooltip="Add Property"/>
    //         ]} />
    //   );
    //   return list;
    // };

    // let options = optionsMapper(workflow.options, []);
    let options = (
      <ListItem>
        <div style={{background: 'white', overflow: 'hidden'}}>
          <JsonInspector
              search={false}
              isExpanded={() => true}
              interactiveLabel={InteractiveSelectionFactory}
              data={workflow.options || {}} />
        </div>
      </ListItem>
    );

    let tasks = workflow.tasks;
    if (tasks && tasks.length) {
      tasks = tasks.map((task, i) => {
        return (
          <ListItem key={i}>
            <WETaskOutline ref={'task-' + i} model={task} />
          </ListItem>
        );
      });
    }
    else {
      tasks = (
        <ListItem>No Tasks.</ListItem>
      );
    }
    return (
      <div className={this.props.className}>
        <List
            subheader="Workflow:">
          <ListItem
              leftCheckbox={<Checkbox ref="selected" onCheck={this.selectWorkflow.bind(this)}/>}
              rightIconButton={
                <IconButton
                    iconClassName="fa fa-at"
                    tooltip="Workflow Name"
                    tooltipPosition="top-left" />
              }>
            {workflow.friendlyName || '(Unknown)'}
          </ListItem>
          <ListItem
              ref="options"
              primaryText="Options"
              onTouchTap={this.toggleListItem.bind(this, 'options')}
              leftIcon={<FontIcon className="fa fa-info-circle" />}>
            {options}
          </ListItem>
          <ListItem
              ref="tasks"
              primaryText="Tasks"
              onTouchTap={this.toggleListItem.bind(this, 'tasks')}
              leftIcon={<FontIcon className="fa fa-tasks" />}>
            {tasks}
          </ListItem>
        </List>

      </div>
    );
  }

  stopEvent(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  toggleListItem(name, e) {
    this.stopEvent(e);
    var listItem = this.refs[name];
    listItem.setState({open: !listItem.state.open});
  }

  selectWorkflow(e, toggled) {
    // this.stopEvent(e);
    // console.log(toggled, );
    this.state.model._.groupComponent.refs.panel.toggleSelected();
    // if (toggled) {
    //   this.context.layout.refs.graphCanvas.selectNode(this.props.model._node, e.shiftKey);
    // }
  }

}
