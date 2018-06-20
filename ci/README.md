# Concourse CI for UI repo 

## Usage

Set up pr-gate and post-merge pipeline with the following commands.

`fly -t rackhd set-pipeline -p rackhd-ui-2.0-pr -c ui-pr-gate.yml --load-vars-from var.yml`
`fly -t rackhd set-pipeline -p rackhd-ui-2.0-post-merge -c ui-post-merge.yml --load-vars-from var.yml`

## Files

 - ui-pr-gate.yml        :   the PR Gate pipeline Job
 - ui-post-merge.yml     :   the Post Merge pipeline Job
 - build-aot.yml         :   build-aot task
 - e2e-test.yml          :   e2e-test task
 - unit-test.yml         :   unit-test task
 - tar-build.yml         :   build tar package task
 - var.yml               :   the credentials and repo variables
 - check_focused_ut.sh   :   the script for check_focused_ut
 - update_demo_docker.sh :   the script for deploy docker environment

## Details

The pr-gate pipeline will be triggered after one pull request is put forward. The post-merge pipeline will be triggered after the pull
request is merged to master branch. After the post-merge pipeline ends successfully, you can open the link `http://10.62.59.160:8081`
in the browser to visit the rackhd web ui 2.0.

