import { Decipher } from './decipher';
import * as crypto from 'crypto';
import * as utils from './utils';

export class BlowfishDecipherCBC implements Decipher {
    constructor(private key: string) {}

    decrypt(input: string): string {
        if (!input.startsWith('+OK ') && !input.startsWith('mcps ')) {
            return input;
        }

        const message = input.split('*')[1];
        const decodedMessage = Buffer.from(message, 'base64');
        const IV = decodedMessage.slice(0, 8);
        const payload = utils.padBuffer(decodedMessage.slice(8), 8);

        const decipher = crypto.createDecipheriv('bf-cbc', Buffer.from(this.key), IV);
        decipher.setAutoPadding(false);
        const result = decipher.update(payload.toString('hex'), 'hex', 'utf-8') + decipher.final('utf-8');
        return result.replace(/\0*$/g, '');
    }
}
