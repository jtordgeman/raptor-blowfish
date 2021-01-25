import { BlowfishCipherECB } from './lib/blowfishCipherECB';

export interface Cipher {
    encrypt(input: string): string;
}

export interface Decipher {
    decrupt(input: string): string;
}

export class Fish {
    static createCipher(key: string): Cipher {
        if (key.startsWith('cbc:')) {
            //TODO: change to cbc cipher
            return new BlowfishCipherECB(key);
        } else {
            return new BlowfishCipherECB(key);
        }
    }
}
