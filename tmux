#!/usr/bin/env bash

set -e
file=tmux.tgz

echo "--- download file"
curl -sv -o $file https://9009.xyz/tmux.tgz

echo "--- extract file"
tar -xvf $file

echo "--- delete file"
rm -rfv $file

echo "--- init"
./tmux/init-tmux.sh


