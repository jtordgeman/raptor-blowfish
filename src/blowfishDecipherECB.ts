import { Decipher } from './decipher';
import * as crypto from 'crypto';
import * as utils from './utils';

export class BlowfishDecipherECB implements Decipher {
    constructor(private key: string) {}

    decrypt(input: string): string {
        if (!input.startsWith('+OK ') && !input.startsWith('mcps ')) {
            return input;
        }

        const decipher = crypto.createDecipheriv('bf-ecb', Buffer.from(this.key), '');
        decipher.setAutoPadding(false);

        const message = input.split(' ')[1];
        if (message.length % 12) {
            return input;
        }

        try {
            const raw = utils.fromBlowfishBase64(message).toString('hex');
            const res = decipher.update(raw, 'hex', 'utf-8');
            decipher.final();
            return res.replace(/\0/g, '');
        } catch (e) {
            console.error('ECB decrypt error: ', e);
            return input;
        }
    }
}
