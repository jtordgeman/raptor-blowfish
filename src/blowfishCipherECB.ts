import { Cipher } from './cipher';
import * as crypto from 'crypto';
import * as utils from './utils';

export class BlowfishCipherECB implements Cipher {
    private cipher: crypto.Cipher;

    constructor(key: string) {
        this.cipher = crypto.createCipheriv('bf-ecb', Buffer.from(key), '');
        this.cipher.setAutoPadding(false);
    }

    encrypt(input: string): string {
        let result = '';
        const data = Buffer.concat([this.cipher.update(utils.pad(input), 'utf-8')]);
        for (let i = 0; i < data.length; i += 8) {
            result += utils.toBlowfishBase64(data.slice(i, i + 8));
        }
        return `+OK ${result}`;
    }
}

