#!/bin/sh
while [ true ]
do
    echo 'calling updater'
    curl https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneStateUpdater
    sleep 3
done

