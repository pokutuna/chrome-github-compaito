#!/bin/sh
set -x
DIR=$(dirname $0)
for size in 128 48 16; do
  convert -geometry ${size}x${size} ${DIR}/compaito.png ${DIR}/sized/compaito${size}.png
done;
