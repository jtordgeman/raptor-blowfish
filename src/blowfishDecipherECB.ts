import { Decipher } from './decipher';
import * as crypto from 'crypto';
import * as utils from './utils';

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

        const message = index.substr(input.indexOf(' ') + 1);
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
