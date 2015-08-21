'use strict';

import page from 'page';
import React from 'mach-react';
import onReady from 'common-web-ui/lib/onReady';

import GSCanvas from '../views/Canvas';
import Layout from '../views/Layout';
import Histogram from '../views/Histogram';
import HistogramBin from '../views/HistogramBin';
import HistogramSet from '../views/HistogramSet';

// import viewers from '../messengers/viewers';

let current = null;

function render(Component, context, props, children) {
  return function (pageContext, next) {
    if (current) { current.unmount(); }
    props.children = children;
    props.params = pageContext.params;
    context.page = pageContext;
    current = new Component(props, context);
    // current.mergeObjectProperty('props', {params: pageContext.params});
    current.mount(document.body);
    if (next) { next(); }
  }
}

function view(...children) {
  let context = {},
      props = {};
  return render(Layout, context, props, children);
}

// Run the application when both DOM is ready and page content is loaded
onReady(() => {
  render(GSCanvas, {}, {
    viewWidth: window.innerWidth,
    viewHeight: window.innerHeight,
  }, ['Hello World'])({});
  // page('*', render(GSCanvas, {}, {}, ['Hello World']))
  // page('*', view(
  //   <HistogramSet>
  //     <Histogram
  //         orient="horizontal"
  //         minCount={0}
  //         maxCount={10}>
  //       <HistogramBin size={1} count={0} value={0} label="1long" />
  //       <HistogramBin size={1} count={1} value={1} label="2" />
  //       <HistogramBin size={1} count={2} value={2} label="3" />
  //       <HistogramBin size={1} count={8} value={3} label="4long" />
  //       <HistogramBin size={1} count={2} value={4} label="5" />
  //       <HistogramBin size={1} count={1} value={5} label="6" />
  //       <HistogramBin size={1} count={0} value={6} label="7" />
  //       <HistogramBin size={2} count={0} value={0} label="1" color="#ccc" />
  //       <HistogramBin size={2} count={1} value={1} label="2" color="#ccc" />
  //       <HistogramBin size={2} count={2} value={2} label="3" color="#ccc" />
  //       <HistogramBin size={2} count={8} value={3} label="4long" color="#ccc" />
  //       <HistogramBin size={2} count={2} value={4} label="5" color="#ccc" />
  //       <HistogramBin size={2} count={1} value={5} label="6" color="#ccc" />
  //       <HistogramBin size={2} count={0} value={6} label="7longlong" color="#ccc" />
  //     </Histogram>
  //     <Histogram
  //         orient="vertical"
  //         minCount={1}
  //         maxCount={10}>
  //       <HistogramBin size={1} count={0} value={0} label="1long" />
  //       <HistogramBin size={1} count={1} value={1} label="2" />
  //       <HistogramBin size={1} count={2} value={2} label="3" />
  //       <HistogramBin size={1} count={8} value={3} label="4long" />
  //       <HistogramBin size={1} count={2} value={4} label="5" />
  //       <HistogramBin size={1} count={1} value={5} label="6" />
  //       <HistogramBin size={1} count={0} value={6} label="7" />
  //       <HistogramBin size={2} count={0} value={0} label="1" color="#ccc" />
  //       <HistogramBin size={2} count={1} value={1} label="2" color="#ccc" />
  //       <HistogramBin size={2} count={2} value={2} label="3" color="#ccc" />
  //       <HistogramBin size={2} count={8} value={3} label="4long" color="#ccc" />
  //       <HistogramBin size={2} count={2} value={4} label="5" color="#ccc" />
  //       <HistogramBin size={2} count={1} value={5} label="6" color="#ccc" />
  //       <HistogramBin size={2} count={0} value={6} label="7longlong" color="#ccc" />
  //     </Histogram>
  //   </HistogramSet>
  // ));
  // page('');
});
