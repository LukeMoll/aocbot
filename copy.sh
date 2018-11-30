#!/bin/bash -

HOST=rockhopper

set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../

echo "Copying from $(basename $DIR)/ to $HOST:"

rsync -auv --exclude-from "$DIR/rsync-exclude.txt" $DIR $HOST: