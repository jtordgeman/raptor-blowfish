import { Cipher } from './cipher';
import * as crypto from 'crypto';
import * as utils from './utils';

export class BlowfishCipherCBC implements Cipher {
    constructor(private key: string) {}

    encrypt(input: string): string {
        const paddedInput = utils.pad(input);
        const IV = Buffer.from(input.slice(0, 8));
        const cipher = crypto.createCipheriv('bf-cbc', Buffer.from(this.key), IV);
        cipher.setAutoPadding(false);
        const encrypted = Buffer.concat([IV, cipher.update(paddedInput, 'utf-8'), cipher.final()]).toString('base64');
        return `+OK *${encrypted}`;
    }
}
