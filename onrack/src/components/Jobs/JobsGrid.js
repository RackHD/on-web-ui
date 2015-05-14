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
import { jobs } from '../../actions/JobActions';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class JobsGrid extends Component {

  state = {jobs: null};

  componentDidMount() {
    this.unwatchJobs = jobs.watchAll('jobs', this);
    this.listJobs();
  }

  componentWillUnmount() { this.unwatchJobs(); }

  render() {
    return (
      <div className="JobsGrid">
        {this.renderGridToolbar({
          label: <a href="#/jobs">Jobs</a>,
          count: this.state.jobs && this.state.jobs.length || 0,
          createButton:
            <RaisedButton label="Create Job" primary={true} onClick={this.createJob.bind(this)} />
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.jobs,
            resultsPerPage: 10
          }, job => (
            {
              ID: <a href={this.routePath('jobs', job.id)}>{this.shortId(job.id)}</a>,
              Name: job.name,
              Actions: [
                <IconButton iconClassName="fa fa-edit"
                            tooltip="Edit Job"
                            touch={true}
                            onClick={this.editJob.bind(this, job.id)} />,
                <IconButton iconClassName="fa fa-remove"
                            tooltip="Remove Job"
                            touch={true}
                            onClick={this.deleteJob.bind(this, job.id)} />
              ]
            }
          ), 'No jobs.')
        }
      </div>
    );
  }

  listJobs() { jobs.list(); }

  editJob(id) { this.routeTo('jobs', id); }

  createJob() { this.routeTo('jobs', 'new'); }

  deleteJob(id) {
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && jobs.destroy(id));
  }

}
