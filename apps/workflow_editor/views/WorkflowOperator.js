// Copyright 2015, EMC, Inc.

'use strict';

import { EventEmitter } from 'events';

import React, { Component, PropTypes } from 'react';
import radium from 'radium';

import mixin from 'common-web-ui/lib/mixin';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';

import {
    AutoComplete,
    CircularProgress,
    FontIcon,
    IconButton,
    Popover,
    RaisedButton
  } from 'material-ui';

import Trie from '../lib/Trie';
import Workflow from '../lib/Workflow';

import TaskDefinitionStore from '../stores/TaskDefinitionStore';
import WorkflowTemplateStore from '../stores/WorkflowTemplateStore';

import TaskJsonView from './TaskJsonView';

@radium
@mixin(RouteHelpers)
export default class WorkflowOperator extends Component {

  static propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    overlay: PropTypes.any,
    style: PropTypes.object,
    workflowName: PropTypes.string
  };

  static defaultProps = {
    className: '',
    css: {},
    overlay: null,
    style: {},
    workflowName: ''
  };

  static contextTypes = {
    app: PropTypes.any,
    muiTheme: PropTypes.any,
    workflowEditor: PropTypes.any
  };

  static childContextTypes = {
    workflowOperator: PropTypes.any
  };

  taskDefinitionStore = new TaskDefinitionStore();

  workflowTemplateStore = new WorkflowTemplateStore(Workflow);

  workflowTrie = new Trie();

  taskTrie = new Trie();

  getTaskDefinition(name) {
    return this.taskDefinitionStore.collection[name];
  }

  getWorkflowTemplate(name) {
    return this.workflowTemplateStore.collection[name];
  }

  getTaskDefinitionFromTask(task) {
    return task.taskDefinition || this.getTaskDefinition(task.taskName) || {};
  }

  events = new EventEmitter();

  state = {
    loading: true,
    overlay: null,
    taskTerm: '',
    tast: null,
    workflow: new Workflow({friendlyName: '', injectableName: '', tasks: []}),
    workflowName: this.props.workflowName,
    workflowTerm: ''
  };

  get activeWorkflow() {
    return this.state.workflow;
  }

  getChildContext() {
    return { workflowOperator: this };
  }

  componentWillMount() {
    this.load(this.props.workflowName);
  }

  componentWillUnmount() {
    this.context.app.setState({customTitle: null, customMenu: null});
  }

  componentWillReceiveProps(nextProps) {
    let props = this.props,
        shouldReloadWorkflow = nextProps.workflow &&
          props.workflow !== nextProps.workflow;

    if (shouldReloadWorkflow) {
      this.load(nextProps.workflow);
    }
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

  workflowChangeTimer = null;

  emitWorkflowChange() {
    this.events.emit('changeWorkflow', this);
  }

  onChangeWorkflow(handler) {
    this.events.on('changeWorkflow', handler);
  }

  offChangeWorkflow(handler) {
    this.events.off('changeWorkflow', handler);
  }

  css = {
    root: {},

    overlay: {
      textAlign: 'center',
      position: 'absolute',
      height: 0,
      width: '100%',
      top: 0,
      zIndex: 999
    }
  }

  render() {
    let { props, state } = this;

    let css = {
      root: [this.css.root, props.css.root, this.props.style],
      overlay: [this.css.overlay, props.css.overlay]
    };

    return (
      <div ref="root"
          className={'WorkflowOperator ' + props.className}
          style={css.root}>

        {props.children}

        <div ref="overlay"
            className="overlay"
            style={css.overlay}>

          {props.overlay}

          {this.renderOverlay()}

          {state.loading && <CircularProgress
              mode="indeterminate"
              size={2}
              style={{marginTop: 200}} />}
        </div>
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
        // TODO: add popovers for running and viewing workflows
        // <this.WorkflowEditorIconButton key="active"
        //     tooltip="Running Workflows"
        //     icon="tasks"
        //     float="right" />,
        // <this.WorkflowEditorIconButton key="run"
        //     tooltip="Run this Workflow"
        //     icon="play"
        //     float="right" />
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
            onClick={this.reload.bind(this)} />,
        <this.WorkflowEditorIconButton key="save"
            tooltip="Save Workflow"
            icon="floppy-o"
            float="left"
            onClick={this.save.bind(this)} />,
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
            onClick={this.add.bind(this)}/>
      ],
      customMenu: customMenu
    });
  }

  renderWorkflowSelect(state = this.state) {
    let allWorkflows = this.workflowTemplateStore.all(),
        filterTerm = state.workflowTerm || '',
        workflows = allWorkflows,
        options = [];

    if (filterTerm) {
      workflows = this.workflowTrie.find(filterTerm);
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
            return this.setState({
              workflow: matchingWorkflow,
              workflowName: matchingWorkflow.injectableName,
              workflowTerm: matchingWorkflow.friendlyName
            }, () => {
              this.emitWorkflowChange();
              this.routeTo('workflow_editor', matchingWorkflow.injectableName);
            });
          }
          // TODO: create configm dialog to create a new workflow
          // if (confirm('Create new workflow: "' + value + '"?')) {
          //   console.log('GOT HERE', value);
          // }
        }} />);
  }

  renderTaskSelect(state = this.state) {
    let allTasks = this.taskDefinitionStore.all(),
        filterTerm = state.taskTerm || '',
        tasks = allTasks,
        options = [];

    if (filterTerm) {
      tasks = this.taskTrie.find(filterTerm);
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
          return this.setState({
            task: matchingTask,
            taskTerm: matchingTask.friendlyName
          });
        }
        // TODO: add warning dialog when the task cannot be found.
        // alert('Unable to find task: "' + value+ '"');
      }} />);
  }

  renderOverlay() {
    let emcTheme = this.context.muiTheme;
    let views = [];
    let closeTaskPopover = () => this.setState({taskPopoverAnchor: null});
    this.lastTaskPopoverAnchor = this.state.taskPopoverAnchor || this.lastTaskPopoverAnchor;
    views.push(
      <Popover key="viewTask"
          style={{width: 500}}
          animated={true}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          open={this.state.taskPopoverAnchor ? true : false}
          anchorEl={this.state.taskPopoverAnchor || this.lastTaskPopoverAnchor}
          onRequestClose={closeTaskPopover} >
        <div style={{padding: 20, border: '1px solid ' + emcTheme.rawTheme.palette.textColor}}>
          <h2 style={{margin: 0}}>{this.state.task && this.state.task.friendlyName || 'No task is selected.'}</h2>
          {this.state.task ? <TaskJsonView object={this.state.task} /> : ''}
          <div style={{textAlign: 'right'}}>
            <RaisedButton primary={true} label="Cancel" onClick={closeTaskPopover}/>
          </div>
        </div>
      </Popover>
    );
    return views;
  }

  add(e) {
    let graphContext = this.context.workflowEditor.refs.graph.context;
    this.activeWorkflow.addTask(graphContext, this.state.task, 'new-task-' + Date.now());
  }

  save(e) {
    this.setState({loading: true}, () => {
      let workflowJson = this.activeWorkflow.json;
      this.workflowTemplateStore.create(workflowJson.injectableName, workflowJson)
        .then(
          () => this.reload(),
          err => console.error(err));
    });
  }

  reload(e) {
    this.load(this.state.workflowName);
  }

  rename(newName) {
    this.activeWorkflow.renameWorkflow(newName);
  }

  load(workflowName) {
    this.setState({loading: true});

    Promise
      .all([
        this.taskDefinitionStore.list(),
        this.workflowTemplateStore.list()
      ])
      .then(() => {
        let workflows = this.workflowTemplateStore.all();
        this.workflowTrie.clear();
        workflows.forEach(workflow => {
          this.workflowTrie.insert(workflow.injectableName, workflow);
          this.workflowTrie.insert(workflow.friendlyName, workflow);
        });

        let tasks = this.taskDefinitionStore.all();
        this.taskTrie.clear();
        tasks.forEach(task => {
          this.taskTrie.insert(task.injectableName, task);
          this.taskTrie.insert(task.friendlyName, task);
        });

        let currentWorkflow = this.state.workflow;

        let finish = () => {
          this.setState({loading: false}, () => {
            if (this.state.workflow !== currentWorkflow) {
              this.emitWorkflowChange();
            }
          });
        };

        if (workflowName) {
          let matchingWorkflow = null;

          workflows.some(workflow => {
            if (workflow.injectableName === workflowName || workflow.friendlyName === workflowName) {
              matchingWorkflow = workflow;
              return true;
            }
          });

          if (matchingWorkflow) {
            if (this.state.workflow === matchingWorkflow) {
              return finish();
            }

            return this.setState({
              workflow: matchingWorkflow,
              workflowName: matchingWorkflow.injectableName,
              workflowTerm: matchingWorkflow.friendlyName
            }, finish);
          }
        }

        finish();
      });
  }

}
