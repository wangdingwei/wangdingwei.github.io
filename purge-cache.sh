#!/bin/sh

curl -X POST "https://api.cloudflare.com/client/v4/zones/0584b4bf8ac832501687142e6d0163e9/purge_cache" \
     -H "X-Auth-Email: wangdingwei@qq.com" \
     -H "X-Auth-Key: 849b9589cabf2930b41938c8e18d29a9686f6" \
     -H "Content-Type: application/json" \
     --data '{"purge_everything":true}'
