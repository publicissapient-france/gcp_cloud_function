#!/usr/bin/env bash

cd "${0%/*}"
source ../bash-lib.sh

# project id where we want to deploy the function
PROJECT="${PROJECT:-jbc-atl-sal-func-techevent}"
SERVICE_ACCOUNT_FILE_NAME="${SERVICE_ACCOUNT_FILE_NAME:-function-deployer-jbc-atl-sal-func-techevent.json}"

#PROJECT="drone-engine.sh"
#SERVICE_ACCOUNT_FILE_NAME=deploy-techevent-drone.json


function_name="droneCallBackSetter"

trigger="--trigger-http"


GCLOUD_IMAGE="229.0.0-alpine"



run_cmd $@