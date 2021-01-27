import { Cipher, Decipher } from './models';
import { BlowfishCipherECB } from './blowfishCipherECB';
import { BlowfishDecipherECB } from './blowfishDecipherECB';

export class Fish {
    static createCipher(key: string): Cipher {
        if (key.startsWith('cbc:')) {
            //TODO: change to cbc cipher
            return new BlowfishCipherECB(key);
        } else {
            return new BlowfishCipherECB(key);
        }
    }

    static createDecipher(key: string): Decipher {
        if (key.startsWith('cbc:')) {
            //TODO: change to cbc cipher
            return new BlowfishDecipherECB(key);
        } else {
            return new BlowfishDecipherECB(key);
        }
    }
}
