// Copyright 2015, EMC, Inc.

let isReady = false;

let readyCallbacks = [];

function onReady(cb, sleep=0) {
  if (isReady) { setTimeout(cb, sleep); }
  else { readyCallbacks.push(cb); }
}

export default onReady;

let readyPromise = new Promise((resolve) => {

  if (window.addEventListener)
    { window.addEventListener('DOMContentLoaded', resolve); }

  else { window.attachEvent('onload', resolve); }

});

readyPromise.then(() => {

  isReady = true;
  readyCallbacks.forEach(cb => setTimeout(cb, 0));
  readyCallbacks.length = 0;

});

readyPromise.catch(err => console.error(err));
