#!/usr/bin/env bash

#gcloud beta functions deploy droneEventConsumer --runtime=nodejs8 --trigger-topic projects/modulom-moludom/topics/drone-events --region=europe-west1
gcloud beta functions deploy droneEventConsumer --runtime=nodejs8 --trigger-resource drone-events --trigger-event google.pubsub.topic.publish --region=europe-west1