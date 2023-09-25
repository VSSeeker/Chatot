#!/bin/sh

if [ -z "$XDG_CACHE_HOME" ]; then
  CACHE_DIR="$HOME/.cache"
else
  CACHE_DIR="$XDG_CACHE_HOME"
fi

OUTPUT=$PWD
echo "Reset directory: $OUTPUT/assets"
mkdir -p $OUTPUT/assets
rm -I $OUTPUT/assets/*

mkdir -p "$CACHE_DIR/Chatot"
cd "$CACHE_DIR/Chatot"

wget "https://play.pokemonshowdown.com/audio/cries/" --recursive --level 1 --no-parent --accept mp3 --no-clobber

cd "play.pokemonshowdown.com/audio/cries"
cp *.mp3 $OUTPUT/assets

cd $OUTPUT
bun bin/rename-assets.ts
bun bin/create-manifest.ts

echo "Done"
