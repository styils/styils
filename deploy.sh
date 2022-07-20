#!/usr/bin/env sh

cd docs/dist

git config --global user.name "github-actions[bot]"
git config --global user.email "zoy-l@outlook.com"
git add -A
git commit -m 'update docs'

git push -f git@github.com:zoy-l/styil.git gh-pages

cd -
