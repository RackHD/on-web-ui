# Copyright 2016, EMC, Inc.

FROM trion/ng-cli-karma

#COPY google-chrome-stable_current_amd64.deb /tmp
COPY ./id_rsa* /tmp/
RUN    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update -y \
    && apt-get install google-chrome-stable -y \
    && apt-get install -y chromium \
    && apt-get install wget \
    && apt-get install sshpass \
    && npm install karma -g \
    && mkdir -p ~/.ssh \
    && cp /tmp/id_rsa* ~/.ssh \
    && chmod 400 ~/.ssh/id_rsa \
    && eval `ssh-agent -s`  && ssh-add ~/.ssh/id_rsa \
    && echo "Host eos2git.cec.lab.emc.com " >> /etc/ssh/ssh_config \
    && echo "   StrictHostKeyChecking no" >> /etc/ssh/ssh_config \
    && echo "   UserKnownHostsFile=/dev/null" >> /etc/ssh/ssh_config \

#############################################
#
# Q: Why add private key to ~/.ssh ?
#
# A: To enable 'git fetch' without prompt of user/password & knownhost confirmation
#
#############################################
#
#(1) eval `ssh-agent -s`/ssh-add:     start a ssh-agent, then add this new private key \
#
#(2) modify /etc/ssh/ssh_config:
#
   #The authenticity of host 'eos2git.cec.lab.emc.com (10.99.248.20)' can't be established.
   #ECDSA key fingerprint is 2e:4d:84:5c:6d:92:a4:db:0b:52:b5:cc:86:5d:dc:10.
   #Are you sure you want to continue connecting (yes/no)? 

