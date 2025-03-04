#!/usr/bin/env bash

set -e
file=tmux.tgz

echo -e "\n--- download file ---\n"
curl -4sv -o $file https://ziz.xyz/tmux.tgz

echo -e "\n--- extract file ---\n"
tar -xvf $file

echo -e "\n--- delete file ---\n"
rm -rfv $file

echo -e "\n--- init ---\n"
./tmux/init-tmux.sh


