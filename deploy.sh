#!/usr/bin/env sh

set -e

npm run build:doc

cd docs/docs/dist

git init
git checkout -b gh-pages
git add -A
git commit -m 'docs'

git push -f git@github.com:zoy-l/styil.git gh-pages

cd -
