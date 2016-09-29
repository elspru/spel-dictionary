#!/bin/bash

API_KEY=`cat .apiKey`;
LANG=$1;
shift;
#echo "$@"
curl -s "https://www.googleapis.com/language/translate/v2?key=${API_KEY}&source=en&target=$LANG&callback=translateText&q=$@" | \
      grep translatedText -A 1 -B 1
