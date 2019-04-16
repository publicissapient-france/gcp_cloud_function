#!/usr/bin/env bash

gcloud functions deploy droneEventsDispatcher --runtime=nodejs8 --trigger-resource drone-events --trigger-event google.pubsub.topic.publish --region=europe-west1