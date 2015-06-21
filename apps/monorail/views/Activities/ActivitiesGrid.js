'use strict';

/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import mixin from 'react-mixin';
import DialogHelpers from 'common-web-ui/mixins/DialogHelpers';
import FormatHelpers from 'common-web-ui/mixins/FormatHelpers';
import RouteHelpers from 'common-web-ui/mixins/RouteHelpers';
import GridHelpers from 'common-web-ui/mixins/GridHelpers';
/* eslint-enable no-unused-vars */

import {
    IconButton,
    RaisedButton
  } from 'material-ui';
import ActivityActions, { activities } from '../../actions/ActivityActions';

@mixin.decorate(DialogHelpers)
@mixin.decorate(FormatHelpers)
@mixin.decorate(RouteHelpers)
@mixin.decorate(GridHelpers)
export default class ActivitiesGrid extends Component {

  state = {activities: null};

  componentDidMount() {
    this.unwatchActivities = activities.watchAll('activities', this);
    this.listActivities();

    ActivityActions.add5();
  }

  componentWillUnmout() { this.unwatchActivities(); }

  render() {
    return (
      <div className="ActivitiesGrid">
        {this.renderGridToolbar({
          label: <a href="#/activities">Activities</a>,
          count: this.state.activities && this.state.activities.length || 0,
          createButton:
            <RaisedButton label="Create Activity" primary={true} onClick={this.createActivity.bind(this)} />
        })}
        <div className="clearfix"></div>
        {
          this.renderGrid({
            results: this.state.activities,
            resultsPerPage: 10
          }, activity => (
            {
              ID: <a href={this.routePath('activities', activity.id)}>{this.shortId(activity.id)}</a>,
              Status: activity.status,
              Actions: [
                <IconButton iconClassName="fa fa-edit"
                            tooltip="Edit Activity"
                            touch={true}
                            onClick={this.editActivity.bind(this, activity.id)} />,
                <IconButton iconClassName="fa fa-remove"
                            tooltip="Remove Activity"
                            touch={true}
                            onClick={this.deleteActivity.bind(this, activity.id)} />
              ]
            }
          ), 'No activities.')
        }
      </div>
    );
  }

  listActivities() { activities.list(); }

  editActivity(id) { this.routeTo('activities', id); }

  createActivity() { this.routeTo('activities', 'new'); }

  deleteActivity(id) {
    this.confirmDialog('Are you sure want to delete: ' + id,
      (confirmed) => confirmed && activities.destroy(id));
  }

}
