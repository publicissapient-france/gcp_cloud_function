#!/usr/bin/env bash

gcloud beta functions deploy droneStateUpdater --runtime=nodejs8 --trigger-http --region=europe-west1