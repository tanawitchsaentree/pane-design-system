#!/bin/sh
# Copies the generated tokens into the package. Run after `node packages/tokens/build.mjs`.
set -e
here="$(cd "$(dirname "$0")/.." && pwd)"
cp "$here/../../tokens/build/swift/PaneTokens.swift" "$here/Sources/PaneKit/PaneTokens.swift"
echo "synced PaneTokens.swift"
