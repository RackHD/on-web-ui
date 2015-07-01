'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import {
    Menu,
  } from 'material-ui';

import TaskStore from '../stores/TaskStore';

let tasks = new TaskStore();

export default class WETray extends Component {

  state = {
    tasks: null
  };

  componentDidMount() {
    this.unwatchTasks = tasks.watchAll('tasks', this);
    this.listTasks();
  }

  componentWillUnmount() {
    this.unwatchTasks();
  }

  render() {
    var taskMenuItems = [];
    var jobMenuItems = [];
    if (this.state.tasks) {
      this.state.tasks.forEach(task => {
        taskMenuItems.push({
          text: task.id,
          task: task
        });
      });
    }
    if (this.state.jobs) {
      this.state.jobs.forEach(job => {
        jobMenuItems.push({
          text: job.id,
          job: job
        });
      });
    }
    return (
      <div className="">
        <Menu menuItems={taskMenuItems}
              onItemClick={this.addTask.bind(this)}
              autoWidth={false} />
      </div>
    );
  }

  listTasks() { return tasks.list(); }

  addTask(event, index, menuItem) {
    var task = menuItem.task;
    if (!task) { return; }
    console.log(task.name);
  }

  addJob(event, index, menuItem) {
    var job = menuItem.job;
    if (!job) { return; }
    console.log(job.name);
  }

}
