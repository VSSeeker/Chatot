import { Dex } from 'pokemon-showdown';
import { readdirSync, unlinkSync, renameSync } from 'node:fs';
import { AUDIO_FORMAT, DIR, MANIFEST } from './_shared';
import { TCGForme } from './_tcgforme';

const files = readdirSync(DIR);

// 1. Rename files
for (const file of files) {
    if (file === MANIFEST) continue;

    const filePath = `${DIR}/${file}`;
    let pkmn = file.replace(AUDIO_FORMAT, '');

    // Already processed
    if (!Number.isNaN(Number(pkmn.replace(/-.*$/, '')))) continue;

    const data = Dex.species.get(pkmn);
    if (data.num <= 0) {
        unlinkSync(filePath);
        console.error('Removing Create-a-Pokemon asset:', pkmn);
        continue;
    }

    let forme = (data.forme || "").replaceAll('-', '');
    // Urshifu cards always have a forme
    if (!forme && data.baseForme === 'Single-Strike') forme = 'SingleStrike';

    if (forme) {
        let tcgFormeIdx = TCGForme[forme]
            ?? TCGForme[`${forme}ian`] // Galarian, etc.
            ?? TCGForme[`${forme}Rider`] // IceRider, ShadowRider

        if (tcgFormeIdx) {
            renameSync(filePath, `${DIR}/${data.num}-${tcgFormeIdx}${AUDIO_FORMAT}`)
        } else {
            console.error(`Unsupported (requires manual tag, deleting):`, pkmn, data.num, forme);
            unlinkSync(filePath);
        }
    } else {
        renameSync(filePath, `${DIR}/${data.num}${AUDIO_FORMAT}`)
    }
}
