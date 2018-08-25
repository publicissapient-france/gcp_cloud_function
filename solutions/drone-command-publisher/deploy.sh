#!/usr/bin/env bash

gcloud beta functions deploy droneCommandPublisher --runtime=nodejs8 --trigger-http --region=europe-west1