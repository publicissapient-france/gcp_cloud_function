#!/usr/bin/env bash

gcloud beta functions deploy droneStateList --runtime=nodejs8  --trigger-http --region=europe-west1
