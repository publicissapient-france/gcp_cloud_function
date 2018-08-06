#!/usr/bin/env bash

gcloud beta functions deploy droneLocationUpdater --runtime=nodejs8 --trigger-http --region=europe-west1