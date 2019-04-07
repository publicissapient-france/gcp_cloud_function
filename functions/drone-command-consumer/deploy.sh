#!/usr/bin/env bash

function_name="droneCommandConsumer"
trigger="--trigger-topic=drone-command"

PROJECT="drone-engine.sh.sh"

GCLOUD_IMAGE="229.0.0-alpine"

case "$1" in
	"auth")
		docker rm gcloud-deploy-techevent-drone-config
		docker run -ti \
			-v "${HOME}/.ssh/deploy-techevent-drone.json":"/root/.ssh/deploy-techevent-drone.json" \
			--name gcloud-deploy-techevent-drone-config \
			google/cloud-sdk:${GCLOUD_IMAGE} gcloud auth activate-service-account --key-file=/root/.ssh/deploy-techevent-drone.json
		;;
	"gcloud")
		docker run -ti --rm \
			--volumes-from gcloud-deploy-techevent-drone-config \
			google/cloud-sdk:${GCLOUD_IMAGE} $@ --project=${PROJECT}
		;;
	"push")
		docker run -ti --rm \
			-v $PWD:/root/src \
			-w /root/src \
			--volumes-from gcloud-deploy-techevent-drone-config \
			google/cloud-sdk:${GCLOUD_IMAGE} /bin/bash -c "\
			gcloud config set project ${PROJECT} && \
			gcloud functions deploy $function_name $trigger --runtime=nodejs8 --region=europe-west1"
		;;
	*)
		echo "please provide a command"
		;;
esac





#-v "$GOOGLE_CREDENTIALS":/root/.ssh/sa-terraform-service-account \
#-e "$GOOGLE_CREDENTIALS"=/root/.ssh/sa-terraform-service-account \

#gcloud beta functions deploy droneCommandConsumer --runtime=nodejs8 --trigger-topic drone-command --region=europe-west1