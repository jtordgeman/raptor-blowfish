![npm](https://img.shields.io/npm/v/raptor-blowfish?style=plastic)
![Zero dependencies](https://img.shields.io/badge/dependencies-0-brightgreen?style=plastic)

# Raptor-Blowfish 🐡

> A TypeScript implementation of the Blowfish cipher to encrypt/decrypt messages in ECB and CBC modes. Zero runtime dependencies.

## Installation

```bash
npm install raptor-blowfish
```

```bash
yarn add raptor-blowfish
```

## Usage
```ts
import { Fish } from 'raptor-blowfish';

// ECB
const enc = Fish.createCipher('myLovelyKey');
const encrypted = enc.encrypt('Toxic'); // +OK O3mP5.mY3eCZ

const dec = Fish.createDecipher('myLovelyKey');
const decrypted = dec.decrypt('+OK O3mP5.mY3eCZ'); // Toxic

// CBC
const cbcEnc = Fish.createCipher('cbc:myLovelyKey');
const cbcEncrypted = cbcEnc.encrypt('Toxic'); // +OK * <random IV, different each call>

const cbcDec = Fish.createDecipher('cbc:myLovelyKey');
const cbcDecrypted = cbcDec.decrypt(cbcEncrypted); // Toxic
```
