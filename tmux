#!/usr/bin/env bash

set -e
file=tmux.tgz

echo -e "--- download file ---\n"
curl -sv -o $file https://9009.xyz/tmux.tgz

echo -e "--- extract file ---\n"
tar -xvf $file

echo "--- delete file ---\n"
rm -rfv $file

echo -e "--- init ---\n"
./tmux/init-tmux.sh


