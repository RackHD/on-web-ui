// Copyright 2016, EMC, Inc.
/* global describe, it, expect, before, after */
/* eslint-disable prefer-arrow-callback */

import RackHDRestAPIv1_1 from 'src-common/messengers/RackHDRestAPIv1_1';

describe('Operation Center', function() {
  this.timeout(5000);

  before(function(done) {
    const check = () => {
      const operationsCenter = document.querySelector('.OperationsCenter'),
            operationsCenterGraph = document.querySelector('.OperationsCenterGraph'),
            activeOperationsList = document.querySelector('.ActiveOperationsList');
      if (operationsCenter &&
          operationsCenterGraph &&
          activeOperationsList) return done();
      setTimeout(check, 50);
    };
    window.location.hash = '#/oc';
    check();
  });

  after(function() {
    delete this.domNodes;
  });

  it('is ok', function() {
    expect(true).to.be.ok;
  });

  describe('a new workflow', function() {
    before(function(done) {
      RackHDRestAPIv1_1.nodes.post({
        name: 'test-node-noop-workflow',
        type: 'compute'
      }).catch(done).then(node => {
        this.node = node;
        RackHDRestAPIv1_1.nodes.postWorkflow(this.node.id, {
          name: 'Graph.noop-example',
          node: this.node.id
        }).catch(done).then(workflow => {
          this.workflow = workflow;
          // global.monorailApp.forceUpdate(done);
          done();
        });
      });
    });

    after(function() {
      delete this.node;
      delete this.workflow;
    });

    it('is ok', function() {
      // console.log(this.node, this.workflow);
      expect(this.node).to.be.ok;
      expect(this.workflow).to.be.ok;
    });

    it('should appear in the active workflow list', function(done) {
      const domCheck = () => {
        let workflowLink = document.querySelector('.Workflow-' + this.workflow.instanceId);
        // console.log(workflowLink, this.workflow);
        if (workflowLink) return done();
        setTimeout(domCheck, 50);
      };
      domCheck();
    });
  });
});
