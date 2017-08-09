#!/bin/bash -ex

start_depends_services(){
    set +e
    echo $SUDO_PASSWORD |sudo -S service mongodb start
    echo $SUDO_PASSWORD |sudo -S service rabbitmq-server start
    set -e
}

prepare_deps(){
    pushd ${WORKSPACE}
    mkdir -p xunit-reports
    ./build-config/build-release-tools/HWIMO-BUILD ./build-config/build-release-tools/application/reprove.py \
    --manifest ${MANIFEST_FILE_PATH} \
    --builddir ${WORKSPACE}/build-deps \
    --jobs 2 \
    --force \
    checkout \
    packagerefs
    if [ -d "build-deps/on-build-config" ]; then
        rm -rf build-config
        cp -r build-deps/on-build-config build-config
    fi
    mongo pxe --eval "db.dropDatabase()"
    mongo monorail-test --eval "db.dropDatabase()"
    cd build-config && ./build-config "$1"
    cd ..
    popd
}

unit_test(){
    echo "Run unit test under $1"
    npm install

    set +e
    ./node_modules/.bin/istanbul report lcov
    npm install --save-dev mocha-sonar-reporter

    if [ "$1" == "on-web-ui" ]; then
        export CHROME_BIN=chromium-browser
        xvfb-run ./node_modules/.bin/karma start test/karma.conf.js
        return $?
    fi

    npm_package_config_mocha_sonar_reporter_classname="Tests_build.spec" npm_package_config_mocha_sonar_reporter_outputfile=test/$1.xml ./node_modules/.bin/istanbul cover -x "**/spec/**" ./node_modules/.bin/_mocha -- $(find spec -name '*-spec.js') -R mocha-sonar-reporter --require spec/helper.js -t 10000
    set -e
}

start_depends_services
prepare_deps $1
pushd ${WORKSPACE}/build-deps/$1
unit_test $1
cp test/$1.xml ${WORKSPACE}/xunit-reports
popd
