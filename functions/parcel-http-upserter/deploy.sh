#!/usr/bin/env bash

gcloud beta functions deploy parcelHttpUpserter --runtime=nodejs8 --trigger-http --region=europe-west1