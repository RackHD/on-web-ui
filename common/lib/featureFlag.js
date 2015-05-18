'use strict';

export default featureFlag;

const flags = {};

function checkWindowLocationSearch(name, context) {
  var search,
      lookup,
      value;
  if (checkWindowLocationSearch.lookup) {
    lookup = checkWindowLocationSearch.lookup;
  }
  else {
    search = window.location.search;
    lookup = {};
    if (search.charAt(0) === '?') { search = search.slice(1); }
    search = search.split('&');
    search = search.map(param => {
      param = param.split('=');
      var flag = {
        name: param[0],
        value: param[1] === 'false' ? false : true
      };
      lookup[flag.name] = flag;
      return flag;
    });
    checkWindowLocationSearch.lookup = lookup;
  }
  value = lookup[name] && lookup[name].value;
  if (!value && value !== false) { value = context.value; }
  context.value = value;
  return value;
}

function featureFlag(name) {
  if (!flags[name]) {
    flags[name] = {
      name: name,
      value: checkWindowLocationSearch(name, {value: false}),
      on: function() { this.value = true; return this; },
      off: function() { this.value = false; return this; },
      check: function() {
        checkWindowLocationSearch(name, this);
        return this.value === true;
      }
    };
  }

  return flags[name];
}
