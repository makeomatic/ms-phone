#!/bin/bash

set -e

if [ x"$SEMAPHORE" == x"true" ]; then
  yarn doc
  git config user.email "semaphore@makeomatic.co"
  git config user.name "semaphore"
  git add -f ./docs
  git commit -m "docs($SEMAPHORE_BUILD_NUMBER): updated remote public documentation"
  git push origin `git subtree split --prefix docs master`:gh-pages --force
fi
