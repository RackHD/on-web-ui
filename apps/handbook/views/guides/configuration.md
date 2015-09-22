Copyright 2015, EMC, Inc.

# Configuration

By default the application makes api calls to: `http://localhost/api/1.1`

This can be configured in `apps/{app}/config.js` after it is created from the example config.

### Feature Flags

The UI has feature flags to allow features to be toggled on or off. They are set in the config file and can be overridden in the query string of the URL.

For example if you want to disable the `dev` flag you can add: `?dev=false` to the url and it will disable the flag.

### Flags

  * dev - Enables profiling.
