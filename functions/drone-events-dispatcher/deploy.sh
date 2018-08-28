#!/usr/bin/env bash

gcloud beta functions deploy droneEventDispatcher --runtime=nodejs8 --trigger-resource drone-events --trigger-event google.pubsub.topic.publish --region=europe-west1