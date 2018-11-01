#!/usr/bin/env bash

curl -d '{"teamId":"green-937", "url":"value2"}' -H "Content-Type: application/json" -X POST https://europe-west1-jbc-atl-sal-func-techevent.cloudfunctions.net/droneCallBackSetter