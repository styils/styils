#!/usr/bin/env sh

set -e

npm run build:doc

cd docs/dist

git add -A
git commit -m 'update docs'

git push -f git@github.com:zoy-l/styil.git gh-pages

cd -
