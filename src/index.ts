import { Cipher } from './cipher';
import { Decipher } from './decipher';
import { BlowfishCipherECB } from './blowfishCipherECB';
import { BlowfishDecipherECB } from './blowfishDecipherECB';
import { BlowfishCipherCBC } from './blowfishCipherCBC';
import { BlowfishDecipherCBC } from './blowfishDecipherCBC';

export class Fish {
    static createCipher(key: string): Cipher {
        if (key.startsWith('cbc:')) {
            const actualKey = key.substr(4);
            return new BlowfishCipherCBC(actualKey);
        } else {
            return new BlowfishCipherECB(key);
        }
    }

    static createDecipher(key: string): Decipher {
        if (key.startsWith('cbc:')) {
            const actualKey = key.substr(4);
            return new BlowfishDecipherCBC(actualKey);
        } else {
            return new BlowfishDecipherECB(key);
        }
    }
}
