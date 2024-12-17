# Setup defaults
MAKE ?= make
DOCKER ?= docker
PLATFORM ?= linux/arm64/v8,linux/amd64
BUILDER ?= container

version				:= $(shell cat package.json | grep '"version": "' | sed 's/  "version": "//' | tr -d '",')

# Help target borrowed from: https://docs.cloudposse.com/reference/best-practices/make-best-practices/
## This help screen
help:
	@printf "Available targets:\n\n"
	@awk '/^[a-zA-Z\-\_0-9%:\\]+/ { \
	    helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
		    helpCommand = $$1; \
		    helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
		    gsub("\\\\", "", helpCommand); \
		    gsub(":+$$", "", helpCommand); \
		    printf "  \x1b[32;01m%-35s\x1b[0m %s\n", helpCommand, helpMessage; \
		} \
	    } \
	    { lastLine = $$0 }' $(MAKEFILE_LIST) | sort -u
	@printf "\n"

## Build release-ready docker images with proper tags and output push commands in stdout
images_release_multi_load: # entrypoints
	@echo "make sure you have buildx configured 'docker buildx ls', if not 'docker buildx create --name container --driver=docker-container'"
	$(DOCKER) buildx build \
		-t splitsoftware/split-evaluator:latest -t splitsoftware/split-evaluator:$(version) \
		--platform $(PLATFORM) \
		--builder $(BUILDER) \
		--load .
	@echo "Images created. Make sure everything works ok, and then run the following commands to push them."
	@echo "$(DOCKER) push splitsoftware/split-evaluator:$(version)"
	@echo "$(DOCKER) push splitsoftware/split-evaluator:latest"

platform_str		= $(if $(PLATFORM),--platform $(PLATFORM),)
builder_str		= $(if $(BUILDER),--builder $(BUILDER),)
