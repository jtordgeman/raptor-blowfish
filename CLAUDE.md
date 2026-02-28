# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

raptor-blowfish is a TypeScript implementation of the Blowfish cipher for IRC chat encryption, supporting ECB and CBC modes. It has zero runtime dependencies.

## Commands

```bash
# Build (TypeScript -> lib/)
npm run build

# Run all tests
npm test

# Run a single test by name pattern
npm test -- --testNamePattern="ecb encrypt"

# Lint
npm run lint

# Format
npm run format
```

## Architecture

The public API is a single `Fish` class (exported from `src/index.ts`) with two static factory methods:

- `Fish.createCipher(key)` — returns a `Cipher` with an `encrypt(input)` method
- `Fish.createDecipher(key)` — returns a `Decipher` with a `decrypt(input)` method

Key prefix determines the mode: keys starting with `cbc:` use CBC mode, otherwise ECB.

### Source layout

- `src/index.ts` — `Fish` factory class, routes to ECB or CBC implementations based on key prefix
- `src/cipher.ts` / `src/decipher.ts` — interfaces (`Cipher.encrypt`, `Decipher.decrypt`)
- `src/blowfish.ts` — pure TypeScript Blowfish implementation (key expansion, ECB/CBC encrypt/decrypt)
- `src/blowfishConstants.ts` — standard Blowfish initial P-array and S-box values (digits of pi)
- `src/blowfishCipherECB.ts` / `src/blowfishDecipherECB.ts` — ECB mode, custom Blowfish base64 encoding, output prefixed with `+OK`
- `src/blowfishCipherCBC.ts` / `src/blowfishDecipherCBC.ts` — CBC mode with IV handling, standard base64, output prefixed with `+OK *`
- `src/utils.ts` — Blowfish-specific base64 encoding/decoding (custom 64-char alphabet: `./0-9a-zA-Z`), null-byte padding for 8-byte block alignment, uses BigInt for bit manipulation

### Key implementation details

- ECB encrypted output is 12 chars per 8-byte block (Blowfish base64)
- CBC prepends the IV to the ciphertext before base64 encoding
- Decryption accepts both `+OK` and `mcps` message prefixes
- Padding is handled manually with null bytes (no auto-padding)
- Build output goes to `lib/` (CommonJS, ES6 target, with .d.ts declarations)
