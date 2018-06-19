// Copyright 2015, EMC, Inc.

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
    ToolbarTitle
  } from 'material-ui';

import ConfirmDialog from 'src-common/views/ConfirmDialog';

import WorkflowEditorIconButton from './WorkflowEditorIconButton';
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
    return this.workflowOperator.getWorkflowTemplate(name);
  }

  getTaskDefinitionFromTask(task) {
    return this.getWorkflowTemplate.getTaskDefinitionFromTask(task);
  }

  state = {
    confirmCreateWorkflow: false,
    newWorkflowFriendlyName: '',
    newWorkflowInjectableName: '',
    task: null,
    tasks: this.workflowOperator.taskDefinitionStore.all(),
    taskTerm: '',
    workflow: this.activeWorkflow,
    workflows: this.workflowOperator.workflowTemplateStore.all(),
    workflowTerm: this.activeWorkflow && this.activeWorkflow.friendlyName
  };

  get activeWorkflow() {
    return this.workflowOperator.activeWorkflow;
  }

  getChildContext() {
    return { workflowEditorToolbar: this };
  }

  componentDidMount() {
    this.updateWorkflow = () => {
      this.setState({workflow: this.activeWorkflow});
    };
    this.workflowOperator.onChangeWorkflow(this.updateWorkflow);
    this.unwatchTaskDefinitions =
      this.workflowOperator.taskDefinitionStore.watchAll('tasks', this);
    this.unwatchWorkflowTemplates =
      this.workflowOperator.workflowTemplateStore.watchAll('workflows', this);
  }

  componentWillUnmount() {
    this.workflowOperator.offChangeWorkflow(this.updateWorkflow);
    this.unwatchTaskDefinitions();
    this.unwatchWorkflowTemplates();
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

        <ConfirmDialog
            open={this.state.confirmCreateWorkflow}
            callback={confirmed => {
              let workflowName = this.state.newWorkflowFriendlyName,
                  workflowId = this.state.newWorkflowInjectableName;
              this.setState({
                confirmCreateWorkflow: false,
                newWorkflowFriendlyName: '',
                newWorkflowInjectableName: ''
              }, () => {
                if (!confirmed) return;
                this.workflowOperator.workflowTemplateStore.create(workflowId, {
                  friendlyName: workflowName,
                  injectableName: workflowId,
                  tasks: [
                    {
                      label: 'no-op',
                      taskName: 'Task.noop'
                    }
                  ]
                }).then((workflow) => {
                  this.context.router.push('/we/' + workflowId);
                  // HACK: force UI to update and render new workflow.
                  setTimeout(() => window.location.reload(), 250);
                });
              });
            }}>
          Create new Workflow? "{this.state.newWorkflowInjectableName}"?'
        </ConfirmDialog>
      </div>
    );
  }

  renderToolbar() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild={true} firstChild={true}>
          <ToolbarTitle text="&nbsp;" />
          <ToolbarTitle text="Workflow:" />
          {this.renderWorkflowSelect()}
          <WorkflowEditorIconButton key="refresh"
              muiTheme={this.context.muiTheme}
              tooltip="Refresh Workflow"
              icon="refresh"
              firstChild={true}
              onClick={this.workflowOperator.reload.bind(this.workflowOperator)} />
          <WorkflowEditorIconButton key="save"
              muiTheme={this.context.muiTheme}
              tooltip="Save Workflow"
              icon="floppy-o"
              firstChild={true}
              onClick={this.workflowOperator.save.bind(this.workflowOperator)} />
          <WorkflowEditorIconButton key="run"
              muiTheme={this.context.muiTheme}
              tooltip="Run this Workflow"
              icon="play"
              lastChild={true}
              onClick={(e) => this.setState({
                runPopoverAnchor: this.state.runPopoverAnchor === e.currentTarget ? null : e.currentTarget
              })} />
        </ToolbarGroup>
        <ToolbarGroup lastChild={true}>
          <ToolbarTitle text="Task:" />
          {this.renderTaskSelect()}
          <WorkflowEditorIconButton key="view"
              muiTheme={this.context.muiTheme}
              margin={20}
              tooltip="View Task"
              icon="search"
              firstChild={true}
              onClick={(e) => this.setState({
                taskPopoverAnchor: this.state.taskPopoverAnchor === e.currentTarget ? null : e.currentTarget
              })} />
          <WorkflowEditorIconButton key="add"
              muiTheme={this.context.muiTheme}
              tooltip="Add Task"
              icon="plus"
              firstChild={true}
              onClick={this.workflowOperator.add.bind(this.workflowOperator)}/>
        </ToolbarGroup>
      </Toolbar>
    );
  }

  renderWorkflowSelect(state = this.state) {
    let allWorkflows = state.workflows,
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

    return (
      <AutoComplete key="workflows"
          style={{width: 276, top: 8, float: 'left'}}
          filter={() => true}
          openOnFocus={true}
          menuStyle={{maxHeight: 250, width: 276, overflow: 'auto'}}
          animated={true}
          hintText="Select"
          searchText={state.workflowTerm || state.workflow && state.workflow.friendlyName}
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
              this.setState({
                workflow: matchingWorkflow,
                workflowTerm: matchingWorkflow.friendlyName
              }, () => {
                this.workflowOperator.setState({
                  workflow: matchingWorkflow,
                  workflowName: matchingWorkflow.injectableName
                }, () => {
                  this.workflowOperator.emitWorkflowChange();
                  this.context.router.push('/we/' + matchingWorkflow.injectableName);
                });
              });
            }

            else {
              value = value.split(/\s+/).map(word => {
                return word.charAt(0).toUpperCase() + word.substr(1);
              }).join(' ');

              this.setState({
                confirmCreateWorkflow: true,
                newWorkflowFriendlyName: value,
                newWorkflowInjectableName: 'Graph.' + value.replace(' ', '.')
              });
            }
          }}
      />
    );
  }

  renderTaskSelect(state = this.state) {
    let allTasks = state.tasks,
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

    return (
      <AutoComplete
          key={1}
          style={{width: 276, top: 8, float: 'left', marginLeft: 8}}
          filter={() => true}
          openOnFocus={true}
          menuStyle={{maxHeight: 250, width: 276, overflow: 'auto'}}
          animated={true}
          hintText="Select"
          searchText={state.taskTerm || state.task && state.task.friendlyName || ''}
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
              this.setState({taskTerm: matchingTask.friendlyName}, () => {
                this.workflowOperator.setState({task: matchingTask});
              });
            }

            // TODO: add warning dialog when the task cannot be found.
            // alert('Unable to find task: "' + value+ '"');
          }}
      />
    );
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
      </Popover>
    ];
  }

}
