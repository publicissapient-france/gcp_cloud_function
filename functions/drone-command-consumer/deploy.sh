#!/usr/bin/env bash

gcloud beta functions deploy droneCommandConsumer --runtime=nodejs8 --trigger-topic drone-command --region=europe-west1