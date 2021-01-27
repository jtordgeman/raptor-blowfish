import { Cipher, Decipher } from './models';
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

export class BlowfishDecipherECB implements Decipher {
    private decipher: crypto.Decipher;
    constructor(key: string) {
        this.decipher = crypto.createDecipheriv('bf-ecb', Buffer.from(key), '');
        this.decipher.setAutoPadding(false);
    }

    decrypt(input: string): string {
        if (!input.startsWith('+OK ') && !input.startsWith('mcps ')) {
            return input;
        }

        const [_prefix, message] = input.split(' ');
        if (message.length % 12) {
            return input;
        }

        try {
            const raw = utils.fromBlowfishBase64(message).toString('hex');
            const res = this.decipher.update(raw, 'hex', 'utf-8');
            return res.replace(/\0/g, '');
        } catch (e) {
            console.error('ECB decrypt error: ', e);
            return input;
        }
    }
}
