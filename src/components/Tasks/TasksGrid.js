'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from '../mixins/DialogHelpers';
import FormatHelpers from '../mixins/FormatHelpers';
import RouteHelpers from '../mixins/RouteHelpers';
import GridHelpers from '../mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';
import TaskAPI from '../../api/TaskAPI';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class TasksGrid extends Component {

  state = {
    tasks: null
  };

  componentDidMount() { this.getTasks(); }

  render() {
    return (
      <div className="TasksGrid">
        {this.renderGridToolbar({
          label: <a href="#/tasks">Tasks</a>,
          count: this.state.tasks && this.state.tasks.length || 0,
          createButton:
            <RaisedButton label="Create Task" primary={true} onClick={this.createTask.bind(this)} />
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.tasks,
            resultsPerPage: 10
          }, task => (
            {
              ID: <a href={this.routePath('tasks', task.id)}>{this.shortId(task.id)}</a>,
              Name: task.name,
              Actions: [
                <IconButton iconClassName="fa fa-edit"
                            tooltip="Edit Task"
                            touch={true}
                            onClick={this.editTask.bind(this, task.id)} />,
                <IconButton iconClassName="fa fa-remove"
                            tooltip="Remove Task"
                            touch={true}
                            onClick={this.deleteTask.bind(this, task.id)} />
              ]
            }
          ), 'No tasks.')
        }
      </div>
    );
  }

  getTasks() {
    TaskAPI.getTasks()
      .then(tasks => this.setState({tasks: tasks}))
      .catch(err => console.error(err));
  }

  editTask(id) { this.routeTo('tasks', id); }

  createTask() { this.routeTo('tasks', 'new'); }

  deleteTask(id) {
    this.confirmDialog('Are you sure want to delete: ' + id, (confirmed) => {
      if (!confirmed) { return; }

      TaskAPI.deleteTask(id)
        .then(() => this.getTasks())
        .catch(err => console.error(err));
    });
  }

}
