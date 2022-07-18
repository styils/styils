#!/usr/bin/env sh

# 发生错误时终止
set -e

# 构建
npm run build:doc

cd docs/docs/dist

git init
git checkout -b main
git add -A
git commit -m 'docs'

git push -f git@github.com:zoy-l/styil.git gh-pages

cd -
