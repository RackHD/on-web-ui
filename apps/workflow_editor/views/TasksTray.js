'use strict';

import React, { Component } from 'react'; // eslint-disable-line no-unused-vars

import {
    Menu,
    Tabs,
    Tab
  } from 'material-ui';

import { DragSource } from 'react-dnd';

import TaskStore from '../stores/TaskStore';
import JobStore from '../stores/JobStore';

let tasks = new TaskStore();
let jobs = new JobStore();

@DragSource('JOB', { // eslint-disable-line
  beginDrag(props) { return props; }
}, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource,
    isDragging: monitor.isDragging
  };
})
export default class WorkflowsMenu extends Component {

  state = {
    tasks: null,
    jobs: null
  };

  componentDidMount() {
    this.unwatchTasks = tasks.watchAll('tasks', this);
    this.unwatchJobs = jobs.watchAll('jobs', this);
    this.listTasks();
    this.listJobs();
  }

  componentWillUnmount() {
    this.unwatchTasks();
    this.unwatchJobs();
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
      <div className="WorkflowTasksTray container">
        <Tabs>
          <Tab label="Tasks">
            <Menu menuItems={taskMenuItems}
                  onItemClick={this.addTask.bind(this)}
                  autoWidth={false} />
          </Tab>
          <Tab label="Jobs">
            <Menu menuItems={jobMenuItems}
                  onItemClick={this.addJob.bind(this)}
                  autoWidth={false} />
          </Tab>
        </Tabs>
      </div>
    );
  }

  listTasks() { return tasks.list(); }

  listJobs() { return jobs.list(); }

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
