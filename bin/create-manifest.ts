import { readdirSync } from 'node:fs';
import { AUDIO_FORMAT, DIR, MANIFEST } from './_shared';

// Workaround for incompatibility
const allocUnsafeSlow = Buffer.allocUnsafeSlow;
Buffer.allocUnsafeSlow = function (...args) { return allocUnsafeSlow(...args); }

const { Encoder } = await import('cbor-x');

const enc = new Encoder({ useRecords: true });

const files = readdirSync(DIR).map(name => name.replace(AUDIO_FORMAT, ''));

const manifest = {
    cries: { min: -1, max: -1, baseless: [] as number[], formes: {} as Record<string, number[]> }
};

const asNumbers = files.map(name => Number(name)).filter(n => !Number.isNaN(n));
manifest.cries.min = Math.min(...asNumbers);
manifest.cries.max = Math.max(...asNumbers);

const hasBases = new Set();
for (const name of files) {
    const [base, forme] = name.split('-');

    if (forme) {
        if (!manifest.cries.formes[base]) manifest.cries.formes[base] = [];
        manifest.cries.formes[base].push(Number(forme));
    } else {
        hasBases.add(base);
    }
}

for (let i = manifest.cries.min; i <= manifest.cries.max; i++) {
    if (!hasBases.has(String(i))) manifest.cries.baseless.push(i);
}

console.log(`Generated manifest`);
console.log(manifest);

await Bun.write(`${DIR}/${MANIFEST}`, enc.encode(manifest));
