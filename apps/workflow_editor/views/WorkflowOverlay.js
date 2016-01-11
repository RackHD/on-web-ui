// Copyright 2015, EMC, Inc.

'use strict';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import {
    AutoComplete,
    CircularProgress,
    FontIcon,
    IconButton,
    Popover,
    RaisedButton
  } from 'material-ui';

import RunningWorkflows from './RunningWorkflows';
import RunWorkflow from './RunWorkflow';

import TaskJsonView from './TaskJsonView';

@radium
export default class WorkflowOverlay extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    style: PropTypes.object
  };

  static defaultProps = {
    className: '',
    css: {},
    style: {}
  };

  static contextTypes = {
    app: PropTypes.any,
    muiTheme: PropTypes.any,
    workflowEditor: PropTypes.any,
    workflowOperator: PropTypes.any
  };

  static childContextTypes = {
    workflowOverlay: PropTypes.any
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
    loading: true,
    taskTerm: '',
    workflowTerm: ''
  };

  get activeWorkflow() {
    return this.workflowOperator.activeWorkflow;
  }

  getChildContext() {
    return { workflowOverlay: this };
  }

  componentWillUnmount() {
    this.context.app.setState({
      customTitle: null,
      customMenu: null
    });
  }

  componentDidMount() {
    this.renderCustomToolbar();
  }

  scheduleTitleUpdate = false;

  shouldComponentUpdate(nextProps, nextState) {
    this.scheduleTitleUpdate = this.scheduleTitleUpdate ||
      nextState.taskTerm !== this.state.taskTerm ||
      nextState.workflowTerm !== this.state.workflowTerm ||
      (nextState.loading === false && this.state.loading === true);

    return true;
  }

  componentDidUpdate() {
    if (this.scheduleTitleUpdate) {
      this.scheduleTitleUpdate = false;
      this.renderCustomToolbar();
    }
  }

  css = {
    root: {}
  };

  render() {
    let { props, state } = this;

    let css = {
      root: [this.css.root, props.css.root, this.props.style]
    };

    return (
      <div ref="root"
          className={'WorkflowOverlay ' + props.className}
          style={css.root}>
        {props.children}

        {this.renderPopovers()}

        {state.loading && <CircularProgress
            mode="indeterminate"
            size={2}
            style={{marginTop: 200}} />}
      </div>
    );
  }

  WorkflowEditorIconButton = (props) => {
    let emcTheme = this.context.muiTheme;
    let capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
    return (
      <IconButton
          tooltip={props.tooltip}
          style={{float: props.float, ['margin' + capitalize(props.float)]: props.margin || 16}}
          onClick={props.onClick}>
        <FontIcon
            className={'fa fa-' + props.icon}
            color={props.color || emcTheme.rawTheme.palette.alternateTextColor}
            hoverColor={props.hoverColor || emcTheme.rawTheme.palette.textColor} />
      </IconButton>
    );
  };

  renderCustomToolbar() {
    let customMenu = [
      <this.WorkflowEditorIconButton key="active"
          tooltip="Running Workflows"
          icon="tasks"
          float="right"
          onClick={(e) => this.setState({
            runningPopoverAnchor: this.state.runningPopoverAnchor === e.currentTarget ? null : e.currentTarget
          })} />,
      <this.WorkflowEditorIconButton key="run"
          tooltip="Run this Workflow"
          icon="play"
          float="right"
          onClick={(e) => this.setState({
            runPopoverAnchor: this.state.runPopoverAnchor === e.currentTarget ? null : e.currentTarget
          })} />
    ];

    if (this.state.loading) {
      return this.context.app.setState({
        customTitle: <div style={{float: 'left'}}>Loading Workflows...</div>,
        customMenu: customMenu
      });
    }

    this.context.app.setState({
      customTitle: [
        this.renderWorkflowSelect(),
        <this.WorkflowEditorIconButton key="refresh"
            tooltip="Refresh Workflow"
            icon="refresh"
            float="left"
            onClick={this.workflowOperator.reload.bind(this.workflowOperator)} />,
        <this.WorkflowEditorIconButton key="save"
            tooltip="Save Workflow"
            icon="floppy-o"
            float="left"
            onClick={this.workflowOperator.save.bind(this.workflowOperator)} />,
        this.renderTaskSelect(),
        <this.WorkflowEditorIconButton key="view"
            margin={20}
            tooltip="View Task"
            icon="search"
            float="left"
            onClick={(e) => this.setState({
              taskPopoverAnchor: this.state.taskPopoverAnchor === e.currentTarget ? null : e.currentTarget
            })} />,
        <this.WorkflowEditorIconButton key="add"
            tooltip="Add Task"
            icon="plus"
            float="left"
            onClick={this.workflowOperator.add.bind(this.workflowOperator)}/>
      ],
      customMenu: customMenu
    });
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
        showAllItems={true}
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
          let matchingWorkflow = null;
          workflows.some(workflow => {
            if (workflow.injectableName === value || workflow.friendlyName === value) {
              matchingWorkflow = workflow;
              return true;
            }
          });
          if (matchingWorkflow) {
            return this.workflowOperator.setState({
              workflow: matchingWorkflow,
              workflowName: matchingWorkflow.injectableName
            }, () => {
              this.setState({
                workflowTerm: matchingWorkflow.friendlyName
              });
              this.workflowOperator.emitWorkflowChange();
              this.workflowOperator.routeTo('workflow_editor', matchingWorkflow.injectableName);
            });
          }
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
      showAllItems={true}
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
        let matchingTask = null;
        tasks.some(task => {
          if (task.injectableName === value || task.friendlyName === value) {
            matchingTask = task;
            return true;
          }
        });
        if (matchingTask) {
          return this.workflowOperator.setState({
            task: matchingTask
          }, () => {
            this.setState({taskTerm: matchingTask.friendlyName});
          });
        }
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
    this.lastTaskPopoverAnchor = this.state.taskPopoverAnchor || this.lastTaskPopoverAnchor;
    this.lastRunPopoverAnchor = this.state.runPopoverAnchor || this.lastRunPopoverAnchor;
    this.lastRunningPopoverAnchor = this.state.runningPopoverAnchor || this.lastRunningPopoverAnchor;
    return [
      <Popover key="viewTask"
          style={{width: 500}}
          animated={true}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          open={this.state.taskPopoverAnchor ? true : false}
          anchorEl={this.state.taskPopoverAnchor || this.lastTaskPopoverAnchor}
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
          anchorEl={this.state.runPopoverAnchor || this.lastRunPopoverAnchor}
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
          anchorEl={this.state.runningPopoverAnchor || this.lastRunningPopoverAnchor}
          onRequestClose={closeRunningPopover} >
        <div style={containerStyle}>
          <RunningWorkflows />
        </div>
      </Popover>
    ];
  }

}
