#!/bin/bash

set -euxo pipefail

# Run the release in dry run with minimal plugins to avoid npm auth checks.
# Trusted publishing (OIDC) only works during actual publish, not dry runs.
npm run release -- --ci false --dryRun \
  -p @semantic-release/commit-analyzer \
  -p @semantic-release/release-notes-generator \
  -p @semantic-release/github \
  | grep -i "next release version is" > .semver-output

# Push this version to the output
echo "current-version=$([[ $(cat .semver-output) =~ .*([[:digit:]]+\.[[:digit:]]+\.[[:digit:]]+) ]] && echo "${BASH_REMATCH[1]}")" >> "$GITHUB_OUTPUT"
