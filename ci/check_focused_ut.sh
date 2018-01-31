 #!/bin/bash -x

focus_cases=$(find src/app/ -name *.spec.ts|xargs grep "fdescribe")
focus_steps=$(find src/app/ -name *.spec.ts|xargs grep "fit(")
set -x
if [ "$focus_cases" != "" ] || [ "$focus_steps" != "" ];
then
    echo "[Error]: PR should not focus unit-test and skip other test cases. problems here: $focus_cases, $focus_steps"
    exit -1
fi

