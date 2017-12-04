#!/bin/sh

# Copyright 2016, EMC, Inc.

# set -x
mkdir -p /RackHD/web-ui
cp -a -f /RackHD/web-ui-base/* /RackHD/web-ui/

while true; do
  date;
  sleep 120; # 2 minutes
  # sleep 21600; # 6 hours
done
