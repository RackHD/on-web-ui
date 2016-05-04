// Copyright 2015, EMC, Inc.

import React, { Component } from 'react';
import { Link } from 'react-router';
import moment from 'moment';
import { LinearProgress } from 'material-ui';

import FormatHelpers from 'src-common/lib/FormatHelpers';
import ResourceTable from 'src-common/views/ResourceTable';
import CatalogStore from 'src-common/stores/CatalogStore';

export default class CatalogsGrid extends Component {

  catalogs = new CatalogStore();

  state = {
    catalogs: this.props.catalogs,
    loading: !this.props.catalogs
  };

  componentWillMount() {
    this.catalogs.startMessenger();
  }

  componentDidMount() {
    this.unwatchCatlogs = this.catalogs.watchAll('catalogs', this);
    this.listCatalogs();
  }

  componentWillUnmount() {
    this.catalogs.stopMessenger();
    this.unwatchCatlogs();
  }

  render() {
    let catalogsByNode = [];
    if (this.state.catalogs && this.state.catalogs.length) {
      catalogsByNode = {};
      this.state.catalogs.sort(
        (a, b) => moment(b.updatedAt).unix() - moment(a.updatedAt).unix()
      ).forEach(catalog => {
        let branch = catalogsByNode[catalog.node] = catalogsByNode[catalog.node] || [],
            list = branch[branch.length - 1],
            check = false;
        if (list) {
          check = list.some(item => item.source === catalog.source);
          if (!check) {
            list.push(catalog);
          }
          else {
            branch.push([catalog]);
          }
        }
        else {
          branch.push([catalog]);
        }
      });
      catalogsByNode = Object.keys(catalogsByNode).map(node => {
        let branch = catalogsByNode[node];
        return branch.map(list => {
          list = list.sort((a, b) =>
            (a.source < b.source) ? -1 : (a.source > b.source) ? 1 : 0);
          return {
            node,
            sources: list,
            updatedAt: list[list.length - 1].updatedAt
          };
        });
      }).reduce((prev, curr) => prev.concat(curr), []);
    }

    return (
      <ResourceTable
          initialEntities={catalogsByNode}
          routeName="catalogs"
          emptyContent="No catalogs."
          headerContent="Catalogs"
          loadingContent={<LinearProgress mode={this.state.loading ? 'indeterminate' : 'determinate'} value={100} />}
          mapper={catalog => {
            let row = {};
            row.Sources = catalog.sources.map(source => (
              <Link
                  to={'/mc/catalogs/' + source.id}
                  style={{display: 'inline-block', margin: '0 5px'}}>
                {source.source && source.source.toUpperCase()}
              </Link>
            ));
            if (!this.nodeId) {
              row.Node = <Link to={'/mc/nodes/' + catalog.node}>{FormatHelpers.shortId(catalog.node)}</Link>;
            }
            row.Updated = FormatHelpers.fromNow(catalog.updatedAt);
            return row;
          }} />
    );
  }

  get nodeId() { return this.props.nodeId; }

  get source() { return this.props.source; }

  listCatalogs() {
    this.setState({loading: true});
    let nodeId = this.nodeId,
        source = this.source;
    if (nodeId) {
      if (source) {
        return this.catalogs.listNodeSource(nodeId, source)
          .then(() => this.setState({loading: false}));
      }
      return this.catalogs.listNode(nodeId).then(() => this.setState({loading: false}));
    }
    this.catalogs.list().then(() => this.setState({loading: false}));
  }

}
