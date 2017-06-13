#!/bin/bash -x

#if [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "master" ]; then

  echo -e "Publishing to gh-pages...\n"

  git clone --quiet --branch=gh-pages https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG} gh-pages

  cd gh-pages
  pwd
  git rm -rf *
  cp -Rf ../static/* .
  git config user.name ${GIT_USER_NAME} 
  git config user.email ${GIT_USER_EMAIL} 
  git status
  git add --all
  git status
  git commit -a -m "Test"
  git status
  git push -fq origin gh-pages

#fi 
