import { Decipher } from './decipher';
import * as crypto from 'crypto';
import * as utils from './utils';

export class BlowfishDecipherECB implements Decipher {
    constructor(private readonly key: string) {}

    decrypt(input: string): string {
        if (!input.startsWith('+OK ') && !input.startsWith('mcps ')) {
            return input;
        }

        const message = input.split(' ')[1];
        if (!message || message.length % 12) {
            return input;
        }

        try {
            const decipher = crypto.createDecipheriv('bf-ecb', Buffer.from(this.key), '');
            decipher.setAutoPadding(false);
            const raw = utils.fromBlowfishBase64(message).toString('hex');
            const res = decipher.update(raw, 'hex', 'utf-8');
            decipher.final();
            return res.replace(/\0/g, '');
        } catch {
            return input;
        }
    }
}
