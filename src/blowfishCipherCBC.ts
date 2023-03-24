import { Cipher } from './cipher';
import * as crypto from 'crypto';
import * as utils from './utils';

export class BlowfishCipherCBC implements Cipher {
    constructor(private key: string) {}

    encrypt(input: string): string {
        const paddedInput = utils.padBuffer(Buffer.from(input, 'utf8'), 8);
        const IV = Buffer.from(input.slice(0, 8));
        const cipher = crypto.createCipheriv('bf-cbc', Buffer.from(this.key), IV);
        cipher.setAutoPadding(false);
        const encrypted = Buffer.concat([cipher.update(paddedInput), cipher.final()]).toString('base64');
        return `+OK *${encrypted}`;
    }
}
