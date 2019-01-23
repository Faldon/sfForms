#!/bin/bash
CURL=$(which curl)
SED=$(which sed)
CAT=$(which cat)

if [ -z "$CURL" ] || [ -z "$CAT" ] || [ -z "$SED" ]
then
  echo "Make sure you have curl, sed and cat available on your system."
  exit 1
fi
VERSION=$(cat src/sfForms.js | sed -n "s/\s*var version = '\([0-9.]*\)'.*/\1/p")
$CURL -X POST -s --data-urlencode 'input@src/sfForms.js' https://javascript-minifier.com/raw > "dist/sfForms-$VERSION.min.js"
