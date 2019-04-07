#!/usr/bin/env bash

export BASH_LIB=./bash-lib.sh

./drone-callback-setter/drone-engine.sh deploy
./drone-command-consumer/drone-engine.sh deploy
./drone-events-dispatcher/drone-engine.sh deploy
./drone-http-upserter/drone-engine.sh deploy
./drone-state-list/drone-engine.sh deploy
./drone-state-updater/drone-engine.sh deploy
./parcel-http-upserter/drone-engine.sh deploy
./parcel-list/drone-engine.sh deploy
