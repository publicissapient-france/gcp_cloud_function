#!/usr/bin/env bash

gcloud beta functions deploy consoleConsumer --runtime nodejs8 --trigger-resource projects/jbc-atl-sal-func-techevent/topics/drone-events --trigger-event google.pubsub.topic.publish
