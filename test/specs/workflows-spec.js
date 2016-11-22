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
          done();
        });
      });
    });

    after(function() {
      delete this.node;
      delete this.workflow;
    });

    it('is ok', function() {
      expect(this.node).to.be.ok;
      expect(this.workflow).to.be.ok;
    });

    it('should appear in the active workflow list', function(done) {
      const domCheck = () => {
        let workflowLink = document.querySelector('.Workflow-' + this.workflow.instanceId);
        if (workflowLink) return done();
        setTimeout(domCheck, 50);
      };
      domCheck();
    });

    describe('graph view', function() {
      before(function(done) {
        const check = () => {
          let firstWorkflowTaskId;
          for (firstWorkflowTaskId in this.workflow.tasks) {
            if (this.workflow.tasks.hasOwnProperty(firstWorkflowTaskId)) break;
          }
          let firstWorkflowTask = document.querySelector('div[data-id="' + firstWorkflowTaskId + '"]');
          if (firstWorkflowTask) return done();
          setTimeout(check, 50);
        };
        window.location.hash = '#/oc/' + this.workflow.instanceId;
        check();
      });

      it('is ok', function() {
        expect(true).to.be.ok;
      });

      function assertSuccess(workflowTaskId) {
        let workflowTask = document.querySelector('div[data-id="' + workflowTaskId + '"]');
        expect(workflowTask).to.be.ok;
        expect(workflowTask.firstChild.style.borderColor).to.match(/0, 128, 0/);
      }

      it('should have succeded', function() {
        Object.keys(this.workflow.tasks).forEach(assertSuccess);
      });
    });
  });
});
