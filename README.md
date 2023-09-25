# Chatot

Pokemon Cries sourced from [Pokemon Showdown](https://play.pokemonshowdown.com/audio/cries/), renamed to use VSS dexno/forme.

I attempted to concat all audio files into one, resulting in a ~25 min 8MB file. Chrome would completely choke while loading this file for use with the Web Audio API (audio effects), however.

Converting assets to Opus makes them slightly smaller. Safari, however, does not support .opus files, and still needs the original. Since the difference is marginal, I've decided to stick with MP3s for now until Safari gets proper Opus container support.
