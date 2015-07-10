'use strict';

export default function newId(id) {

  if (typeof id === 'string') { return id; }

  if (typeof id === 'number' && id) { id = String.fromCharCode(id) + '-'; }
  else { id = ''; }

  return id +
    Date.now().toString(32).slice(3) + '-' +
    (Math.floor(1200 + Math.random() * 2400)).toString(32);

}
