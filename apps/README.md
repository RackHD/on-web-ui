Copyright 2015, EMC, Inc.

## On Web UI - Apps

All folders in the `./apps/` directory are treated as separate **stand-alone** web applications. Except for the `./apps/common` folder, which goes through the  same build process, but it is meant to be a library used by other apps.

You can still share code between other apps, but the code will not be shared. Each app will be given it's own version of the code bundled. Unless it is code from the **common** app folder.
