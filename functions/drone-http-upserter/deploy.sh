#!/usr/bin/env bash

gcloud beta functions deploy droneHttpUpserter --runtime=nodejs8 --trigger-http --region=europe-west1