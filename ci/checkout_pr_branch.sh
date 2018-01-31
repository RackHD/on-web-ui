#!/bin/bash -e

checkout_pr_branch(){
    PR_ID=$1

    #Start the SSH-Agent and add Private Key for this session
    eval `ssh-agent -s`  && ssh-add ~/.ssh/id_rsa
    
    #mkdir -p  ~/.ssh
    #ssh-keyscan -t rsa eos2git.cec.lab.emc.com >> ~/.ssh/known_hosts
    git -c http.sslVerify=false fetch origin refs/pull/*:refs/remotes/origin/pr/*
    git branch -a

    #Checkout to the PR Branch( origin/pr/xx/merge will merge the PR to the latest master automaticlly by Github)
    git checkout -t origin/pr/${PR_ID}/merge
}



#get Pull Request ID ( this is tips from https://github.com/jtarchie/github-pullrequest-resource)
set +e
PR_ID=$(git config --get pullrequest.id)
set -e
if [ "$PR_ID" != "" ]; then
    echo "Checkout to PR Branch pr/$PR_ID "
    checkout_pr_branch  $PR_ID
else
    echo "Skip PR Branch checkout, because it's not triggered by any PR but SCM change.".
fi
