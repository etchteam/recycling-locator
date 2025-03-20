#!/bin/bash

set -euxo pipefail

# Run the release in dry run so that we can grab the version that this action will publish
npm run release -- --ci false --dryRun | grep -i "Published release" > .semver-output

# Push this version to the output
echo "current-version=$([[ $(cat .semver-output) =~ .*([[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+) ]] && echo "${BASH_REMATCH[1]}")" >> "$GITHUB_OUTPUT"
