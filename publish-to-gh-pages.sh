#!/bin/bash -ex

  echo -e "Publishing build to gh-pages...\n"
  git clone --branch=gh-pages https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git gh-pages
  cd gh-pages
  rm -rf *
  cp -Rf ../static/* .
  git config user.name ${GIT_USER_NAME} 
  git config user.email ${GIT_USER_EMAIL} 
  git add --all
  git commit --allow-empty -m "build from commit ${TRAVIS_COMMIT}"
  git push -fq origin gh-pages
