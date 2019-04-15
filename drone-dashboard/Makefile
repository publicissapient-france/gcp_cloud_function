PROJECT=deploy-techevent-drone

create:
	# create appengine for current project
	gcloud app --project=$(PROJECT) create --region=europe-west


deploy:
	# function to deploy app
	cp app.yaml build/app.yaml
	cd build && gcloud app --project=$(PROJECT) deploy app.yaml


help:
	@printf  "$$(cat Makefile | grep -e "#\|^\w*: \|\w*:$$"| grep -v 'printf' |sed 's/^\(.*:\)/\\033\[1m \1 \\033[0m/g')"

.DEFAULT_GOAL := help
