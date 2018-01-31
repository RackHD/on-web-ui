# Concourse CI for UI repo 

Usage: `fly -t lite set-pipeline --pipeline ui-pr-gate  -c ci/ui-pr-gate.yml  --load-vars-from  ci/var.yml`

Files:

 - ui-pr-gate.yml   :   the PR Gate pipeline Job
 - unit-test.yml    :   unit-test task
 - var.yml          :   the credentials and repo variables
 - container_for_ut/ :  it's the Dockerfile which the container who provides the test enviroinment, which stored in local docker registry.



