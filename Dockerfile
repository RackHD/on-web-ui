# Copyright 2017, EMC, Inc.

FROM node:6-wheezy

COPY . /RackHD/on-web-ui/
WORKDIR /RackHD/on-web-ui

RUN npm install -q
CMD [ "npm", "start" ]

