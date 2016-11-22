// Copyright 2015, EMC, Inc.

import reactTapEventPlugin from 'react-tap-event-plugin';
reactTapEventPlugin();

import React from 'react';
global.React = React;

// bootstrap bundle
import 'src-config';
import 'src-monorail/routes';

if (process.env.NODE_ENV === 'development') {
  let script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', '/webpack-dev-server.js');
  document.body.appendChild(script);
}

// Google Analytics
/* eslint-disable */
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-69712167-3', 'auto');
ga('send', 'pageview');
/* eslint-enable */
