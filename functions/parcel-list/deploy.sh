#!/usr/bin/env bash

gcloud beta functions deploy parcelList --runtime=nodejs8  --trigger-http --region=europe-west1
