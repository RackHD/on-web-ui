FROM debian:stable

# COPY provision.sh /tmp/provision.sh

# ENV JENKINS_PROVISION 1
# ENV VERBOSE_PROVISION 1
# ENV TEST_ON_WEB_UI 1
# ENV RUN_ON_WEB_UI 1

# RUN /tmp/provision.sh
# RUN cd /home/on-web-ui
MOUNT .
RUN ./provision.sh

ENTRYPOINT ["gulp"]
# CMD ["param"]
