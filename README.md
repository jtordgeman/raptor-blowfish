# Raptor-Blowfish 🐡

> A TypesScript implementation of the Blowfish cipher to encrypt/decrypt messages in ECB and CBC modes.

## Installation

```bash
npm install raptor-blowfish
```

## Usage
```javascript
import { Fish } from 'raptor-blowfish';

//ECB
const enc = Fish.createCipher('myLovelyKey');
const encrypted = enc.encrypt('Toxic'); // +OK O3mP5.mY3eCZ

const dec = Fish.createDecipher('myLovelyKey');
const decrypted = dec.decrypt('+OK O3mP5.mY3eCZ') // Toxic

//CBC
const cbcEnc = Fish.createCipher('cbc:myLovelyKey');
const cbcEncrypted =  enc.encrypt('Toxic');

const cbcDec = Fish.createDecipher('cbc:myLovelyKey');
const cbcDecrypted = dec.decrypt(cbcEncrypted) // Toxic
```


