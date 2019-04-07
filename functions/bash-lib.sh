#!/usr/bin/env bash


function run_cmd() {
	DOCKER_NAME="gcloud-deploy_$PROJECT"

	case "$1" in
		"auth")
			docker rm "$DOCKER_NAME"
			docker run -ti \
				-v "${HOME}/.ssh/${SERVICE_ACCOUNT_FILE_NAME}":"/root/.ssh/${SERVICE_ACCOUNT_FILE_NAME}" \
				--name "$DOCKER_NAME" \
				google/cloud-sdk:${GCLOUD_IMAGE} /bin/bash -c "\
				gcloud auth activate-service-account --key-file=/root/.ssh/${SERVICE_ACCOUNT_FILE_NAME} && \
				gcloud config set project ${PROJECT}"
			;;
		"gcloud")
			docker run -ti --rm \
				--volumes-from "$DOCKER_NAME" \
				google/cloud-sdk:${GCLOUD_IMAGE} $@ --project=${PROJECT}
			;;
		"deploy")
			echo "will deploy   ${function_name}   to project:  ${PROJECT}"
			sleep 2
			docker run -ti --rm \
				-v $PWD:/root/src \
				-w /root/src \
				--volumes-from "$DOCKER_NAME" \
				google/cloud-sdk:${GCLOUD_IMAGE} /bin/bash -c "\
				gcloud functions deploy $function_name $trigger --runtime=nodejs8 --region=europe-west1"
			;;
		"status")
			echo "Working on project '$PROJECT', configured to deploy function '$function_name' with trigger  '$trigger'"
			;;
		*)
			help
			;;
	esac
}

function help() {
cat << EOF
usage: auth | deploy | gcloud

auth: will create a gcloud authenticated docker container. Do it one and the use the other commands
deploy: will deploy function:  '$function_name'  with trigger  '$trigger'  in project  '$PROJECT'
gcloud: run a gcloud command

EOF
}