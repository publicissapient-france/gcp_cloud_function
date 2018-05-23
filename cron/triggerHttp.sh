#!/bin/sh
while [ true ]
do
    echo 'calling updater'
    curl https://us-central1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneLocationUpdater
    sleep 3
done

