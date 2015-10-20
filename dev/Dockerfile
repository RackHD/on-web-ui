FROM debian:latest

# Copyright 2015, EMC, Inc.

# ENV JENKINS_PROVISION 1
ENV VERBOSE_PROVISION 1
# ENV TEST_ON_WEB_UI 1
# ENV RUN_ON_WEB_UI 1

MOUNT ..
RUN ./provision.sh

ENTRYPOINT ["gulp"]
# CMD ["param"]
