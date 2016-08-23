// Copyright 2015, EMC, Inc.

import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import ElasticsearchAPI from 'src-common/messengers/ElasticsearchAPI';
import ConfirmDialog from 'src-common/views/ConfirmDialog';

import EditWorkflow from './EditWorkflow';
import CreateWorkflow from './CreateWorkflow';
export { CreateWorkflow, EditWorkflow };

import {
    FlatButton,
    FontIcon,
    LinearProgress,
    List, ListItem,
    RaisedButton,
    Tabs, Tab,
    Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle
  } from 'material-ui';

import JsonInspector from 'react-json-inspector';

import Console from 'src-common/views/Console';

import WorkflowMonitor from '../../lib/WorkflowMonitor';
import WorkflowStore from 'src-common/stores/WorkflowStore';

export default class Workflow extends Component {

  static contextTypes = {
    router: PropTypes.any
  };

  workflows = new WorkflowStore();

  state = {
    // confirmDelete: false,
    loading: true,
    previousLogs: [],
    realtimeLogs: [],
    state: 'Pending',
    workflow: null
  };

  componentDidMount() {
    this.unwatchWorkflow = this.workflows.watchOne(this.getWorkflowId(), 'workflow', this);
    this.readWorkflow().then(() => {
      this.workflowMonitor = new WorkflowMonitor(this.state.workflow, {
        logs: msg => {
          this.setState(state => {
            return {realtimeLogs: [msg.data].concat(state.realtimeLogs)};
          });
        },
        events: (msg, pattern) => {
          this.setState({state: pattern[1] === 'finished' ? 'Finished' : 'Started'});
          this.readWorkflow();
        }
      });
    });
  }

  componentWillUnmount() {
    this.unwatchWorkflow();
    if (this.workflowMonitor) {
      this.workflowMonitor.disconnect();
    }
  }

  loadPreviousLogs(offset=0, size=100) {
    let nodeId = this.workflows.getNodeId(this.state.workflow);
    if (!nodeId) return Promise.resolve();

    return ElasticsearchAPI.search({
      q: 'subject:' + this.state.workflow.node,
      sort: 'timestamp:desc',
      index: 'logstash-*',
      from: offset,
      size
    });
  }

  render() {
    let { state } = this;

    let workflow = state.workflow || {};

    let logs = state.previousLogs.concat(state.realtimeLogs).sort(
      (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix()
    );

    return (
      <div className="Workflow">
        <LinearProgress mode={state.loading ? 'indeterminate' : 'determinate'} value={100} />

        {/*<ConfirmDialog
            open={state.confirmDelete}
            callback={confirmed => {
              if (confirmed) {
                return this.workflows.destroy(workflow.context.graphId).
                  then(() => this.context.routes.goBack())
              }
              this.setState({loading: false, confirmDelete: false})
            }} >
          Are you sure want to delete this Workflow? "{workflow.context.graphId}"
        </ConfirmDialog>*/}

        <Tabs>
          <Tab
              icon={<FontIcon className="fa fa-server" />}
              label="Details">

            <Toolbar>
              <ToolbarGroup key={0} firstChild={true}>
                <ToolbarTitle text="Workflow Details" />
              </ToolbarGroup>
              <ToolbarGroup key={1} lastChild={true}>
                <RaisedButton
                    label="View Graph"
                    onClick={() =>
                      this.context.router.push('/oc/' + workflow.instanceId)
                    }
                    primary={true} />
                <RaisedButton
                    label="Edit Definition"
                    onClick={() =>
                      workflow.definition &&
                        this.context.router.push('/we/' + workflow.definition.injectableName)
                    }
                    primary={true} />
                {/*<RaisedButton
                    label="Delete Workflow"
                    primary={true}
                    onClick={this.deleteWorkflow.bind(this)}
                    disabled={state.loading} />*/}
              </ToolbarGroup>
            </Toolbar>
            <List>
              <ListItem
                  primaryText={workflow._status || state.state || '(Unknown)'}
                  secondaryText="Status" />
            </List>
            <div style={{overflow: 'auto', margin: 10}}>
              <JsonInspector
                  isExpanded={() => !true}
                  data={state.workflow || {}} />
            </div>
          </Tab>

          <Tab
              icon={<FontIcon className="fa fa-terminal" />}
              label="Console">

            <Console
              elements={logs}
              height={Math.max(500, window.innerHeight * 0.75)}
              handleInfiniteLoad={cb => {
                this.loadPreviousLogs(logs.length).then(res => {
                  let previousLogs = res.hits.hits.map(hit => hit._source);

                  this.setState(state => {
                    previousLogs = previousLogs.concat(state.previousLogs);
                    return { previousLogs };
                  }, cb);
                }).catch(cb);
              }} />

          </Tab>
          <Tab
              icon={<FontIcon className="fa fa-edit" />}
              label="Editor">

            <EditWorkflow workflow={state.workflow} />

          </Tab>
        </Tabs>
      </div>
    );
  }

  getWorkflowId() { return this.props.params.workflowId; }

  readWorkflow() {
    this.setState({loading: true});
    return this.workflows.read(this.getWorkflowId()).then(() => this.setState({loading: false}));
  }

  // deleteWorkflow() {
  //   this.setState({loading: true, confirmDelete: true});
  // }

}
