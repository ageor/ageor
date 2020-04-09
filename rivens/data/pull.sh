#!/usr/bin/env bash

suffix=$(date +"%y%m%d.json")

curl http://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivensPC.json --output $PWD/pc$suffix
curl http://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivensXB1.json --output $PWD/xb$suffix
curl http://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivensPS4.json --output $PWD/ps$suffix
curl http://n9e5v4d8.ssl.hwcdn.net/repos/weeklyRivensSWI.json --output $PWD/sw$suffix

echo
