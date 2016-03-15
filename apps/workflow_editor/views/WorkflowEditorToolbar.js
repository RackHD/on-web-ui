// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import {
    AutoComplete,
    FontIcon,
    IconButton,
    Popover,
    RaisedButton,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    ToolbarTitle
  } from 'material-ui';

import WorkflowEditorIconButton from './WorkflowEditorIconButton';

import RunningWorkflows from './RunningWorkflows';
import RunWorkflow from './RunWorkflow';

import TaskJsonView from './TaskJsonView';

@radium
export default class WorkflowEditorToolbar extends Component {

  static contextTypes = {
    app: PropTypes.any,
    muiTheme: PropTypes.any,
    router: PropTypes.any,
    workflowEditor: PropTypes.any,
    workflowOperator: PropTypes.any
  };

  static childContextTypes = {
    workflowEditorToolbar: PropTypes.any
  };

  get workflowOperator() {
    return this.context.workflowOperator;
  }

  getTaskDefinition(name) {
    return this.workflowOperator.getTaskDefinition(name);
  }

  getWorkflowTemplate(name) {
    return this.workflowOperator.getWorkflowTemplate(name)
  }

  getTaskDefinitionFromTask(task) {
    return this.getWorkflowTemplate.getTaskDefinitionFromTask(task);
  }

  state = {
    taskTerm: '',
    workflowTerm: ''
  };

  get activeWorkflow() {
    return this.workflowOperator.activeWorkflow;
  }

  getChildContext() {
    return { workflowEditorToolbar: this };
  }

  render() {
    let divStyle = {
      height: this.props.height,
      width: '100%',
      float: 'left',
      clear: 'both',
      overflow: 'visible',
      position: 'relative',
      zIndex: 9
    };
    return (
      <div className="WorkflowEditorToolbar" style={divStyle}>
        {this.renderToolbar()}
        {this.renderPopovers()}
      </div>
    );
  }

  renderToolbar() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true} float="left">
        <ToolbarTitle text="&nbsp;" />
          {/*<ToolbarTitle text="Graph" />*/}
          {this.renderWorkflowSelect()}
          <WorkflowEditorIconButton key="refresh"
              muiTheme={this.context.muiTheme}
              tooltip="Refresh Workflow"
              icon="refresh"
              float="left"
              onClick={this.workflowOperator.reload.bind(this.workflowOperator)} />
          <WorkflowEditorIconButton key="save"
              muiTheme={this.context.muiTheme}
              tooltip="Save Workflow"
              icon="floppy-o"
              float="left"
              onClick={this.workflowOperator.save.bind(this.workflowOperator)} />
          {/*<ToolbarSeparator />*/}
        </ToolbarGroup>
        <ToolbarGroup float="left">
          {/*<ToolbarTitle text="Task" />*/}
          {this.renderTaskSelect()}
          <WorkflowEditorIconButton key="view"
              muiTheme={this.context.muiTheme}
              margin={20}
              tooltip="View Task"
              icon="search"
              float="left"
              onClick={(e) => this.setState({
                taskPopoverAnchor: this.state.taskPopoverAnchor === e.currentTarget ? null : e.currentTarget
              })} />
          <WorkflowEditorIconButton key="add"
              muiTheme={this.context.muiTheme}
              tooltip="Add Task"
              icon="plus"
              float="left"
              onClick={this.workflowOperator.add.bind(this.workflowOperator)}/>
          {/*<ToolbarSeparator />*/}
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <ToolbarTitle text="Ops" />
          <ToolbarSeparator />
          <WorkflowEditorIconButton key="active"
              muiTheme={this.context.muiTheme}
              tooltip="Running Workflows"
              icon="tasks"
              float="right"
              onClick={(e) => this.setState({
                runningPopoverAnchor: this.state.runningPopoverAnchor === e.currentTarget ? null : e.currentTarget
              })} />
          <WorkflowEditorIconButton key="run"
              muiTheme={this.context.muiTheme}
              tooltip="Run this Workflow"
              icon="play"
              float="right"
              onClick={(e) => this.setState({
                runPopoverAnchor: this.state.runPopoverAnchor === e.currentTarget ? null : e.currentTarget
              })} />
        </ToolbarGroup>
      </Toolbar>
    );
  }

  renderWorkflowSelect(state = this.state) {
    let allWorkflows = this.workflowOperator.workflowTemplateStore.all(),
        filterTerm = state.workflowTerm || '',
        workflows = allWorkflows,
        options = [];

    if (filterTerm) {
      workflows = this.workflowOperator.workflowTrie.find(filterTerm);
    }

    (filterTerm ? workflows : allWorkflows).forEach((workflow, i) => {
      if (!workflow) { return; }
      options.push(workflow.friendlyName);
    });

    return (<AutoComplete key="workflows"
        style={{width: 276, top: -8, float: 'left'}}
        filter={() => true}
        triggerUpdateOnFocus={!state.workflowTerm}
        menuStyle={{maxHeight: 250, width: 276, overflow: 'auto'}}
        animated={true}
        hintText="Workflow Name"
        floatingLabelText={state.workflowName ? 'Active Workflow:' : 'Choose a Workflow...'}
        searchText={state.workflowTerm}
        dataSource={options}
        onUpdateInput={(value) => {
          this.setState({workflowTerm: value});
        }}
        onNewRequest={(value, injectableName) => {
          // let matchingWorkflow = null;
          // workflows.some(workflow => {
          //   if (workflow.injectableName === value || workflow.friendlyName === value) {
          //     matchingWorkflow = workflow;
          //     return true;
          //   }
          // });
          // if (matchingWorkflow) {
            // this.setState({
            //   workflowTerm: matchingWorkflow.friendlyName
            // }, () => {
              // this.workflowOperator.setState({
              //   workflow: matchingWorkflow,
              //   workflowName: matchingWorkflow.injectableName
              // }, () => {
              //   this.workflowOperator.emitWorkflowChange();
              //   this.context.router.push('/we/' + matchingWorkflow.injectableName);
              // });
            // });
          // }
          // else {
            // TODO: create configm dialog to create a new workflow
            // if (confirm('Create new workflow: "' + value + '"?')) {
            //   console.log('GOT HERE', value);
            // }
          // }
        }} />);
  }

  renderTaskSelect(state = this.state) {
    let allTasks = this.workflowOperator.taskDefinitionStore.all(),
        filterTerm = state.taskTerm || '',
        tasks = allTasks,
        options = [];

    if (filterTerm) {
      tasks = this.workflowOperator.taskTrie.find(filterTerm);
    }

    (filterTerm ? tasks : allTasks).forEach((task, i) => {
      if (!task) { return; }
      options.push(task.friendlyName);
    });

    return (<AutoComplete
      key={1}
      style={{width: 276, top: -8, float: 'left', marginLeft: 8}}
      filter={() => true}
      triggerUpdateOnFocus={!state.taskTerm}
      menuStyle={{maxHeight: 250, width: 276, overflow: 'auto'}}
      animated={true}
      hintText="Task Name"
      floatingLabelText={state.task ? 'Selected Task:' : 'Add a Task...'}
      searchText={state.taskTerm}
      dataSource={options}
      onUpdateInput={(value) => {
        this.setState({taskTerm: value});
      }}
      onNewRequest={(value, injectableName) => {
        // let matchingTask = null;
        // tasks.some(task => {
        //   if (task.injectableName === value || task.friendlyName === value) {
        //     matchingTask = task;
        //     return true;
        //   }
        // });
        // if (matchingTask) {
          // this.setState({taskTerm: matchingTask.friendlyName}, () => {
            // this.workflowOperator.setState({task: matchingTask});
          // });
        // }
        // TODO: add warning dialog when the task cannot be found.
        // alert('Unable to find task: "' + value+ '"');
      }} />);
  }

  renderPopovers() {
    let closeTaskPopover = () => this.setState({taskPopoverAnchor: null}),
        closeRunPopover = () => this.setState({runPopoverAnchor: null}),
        closeRunningPopover = () => this.setState({runningPopoverAnchor: null}),
        emcTheme = this.context.muiTheme,
        task = this.workflowOperator.state.task,
        workflow = this.workflowOperator.state.workflow,
        containerStyle = {
          padding: 20,
          maxHeight: window.innerHeight - 200,
          overflow: 'auto',
          border: '1px solid ' + emcTheme.rawTheme.palette.textColor
        };
    return [
      <Popover key="viewTask"
          style={{width: 500}}
          animated={true}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          open={this.state.taskPopoverAnchor ? true : false}
          anchorEl={this.state.taskPopoverAnchor}
          onRequestClose={closeTaskPopover} >
        <div style={containerStyle}>
          {task && task.friendlyName ?
            <TaskJsonView object={task} /> :
            <h2 style={{margin: 0}}>No task is selected.</h2>}
          <div style={{textAlign: 'right'}}>
            <RaisedButton primary={true} label="Cancel" onClick={closeTaskPopover}/>
          </div>
        </div>
      </Popover>,
      <Popover key="runWorkflow"
          style={{width: 600}}
          animated={true}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          open={this.state.runPopoverAnchor ? true : false}
          anchorEl={this.state.runPopoverAnchor}
          onRequestClose={closeRunPopover} >
        <div style={containerStyle}>
          <RunWorkflow
              name={workflow && workflow.injectableName}
              options={workflow && workflow.options && workflow.options.defaults}
              onDone={(err) => {
                console.error(err);
                closeRunPopover();
              }} />
        </div>
      </Popover>,
      <Popover key="viewRunning"
          style={{width: 800}}
          animated={true}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          open={this.state.runningPopoverAnchor ? true : false}
          anchorEl={this.state.runningPopoverAnchor}
          onRequestClose={closeRunningPopover} >
        <div style={containerStyle}>
          <RunningWorkflows />
        </div>
      </Popover>
    ];
  }

}
