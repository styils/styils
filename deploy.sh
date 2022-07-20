#!/usr/bin/env sh

cd docs/dist

ls

git config --global user.name "github-actions[bot]"
git config --global user.email "zoy-l@outlook.com"

git init
git checkout -B gh-pages
git add -A

git commit -m 'docs: update docs'

git push -f git@github.com:zoy-l/styil.git gh-pages

# cd -
