#Copyright 2017, EMC, Inc.

FROM node:6-wheezy

COPY . /RackHD/on-web-ui/
COPY ./docker-entrypoint.sh /docker-entrypoint.sh

RUN cd /RackHD/on-web-ui \
    && mv ./src/config/custom.json.docker ./src/config/custom.json \
    && npm install -q \
    && npm run build \
    && mkdir -p /RackHD/web-ui-base \
    && mv static/* /RackHD/web-ui-base/ \
    && rm -rf /RackHD/on-web-ui


CMD [ "/docker-entrypoint.sh" ]
