import { Cipher } from './cipher';
import * as crypto from 'crypto';
import * as utils from './utils';

export class BlowfishCipherECB implements Cipher {
    constructor(private key: string) {}

    encrypt(input: string): string {
        let result = '';
        const cipher = crypto.createCipheriv('bf-ecb', Buffer.from(this.key), '');
        cipher.setAutoPadding(false);
        const data = Buffer.from(cipher.update(utils.pad(input, 8), 'utf-8'));
        for (let i = 0; i < data.length; i += 8) {
            result += utils.toBlowfishBase64(data.slice(i, i + 8));
        }
        cipher.final();
        return `+OK ${result}`;
    }
}
