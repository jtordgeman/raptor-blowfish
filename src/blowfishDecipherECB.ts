import { Decipher } from './decipher';
import { Blowfish } from './blowfish';
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
            const bf = new Blowfish(Buffer.from(this.key));
            const res = bf.decryptECB(utils.fromBlowfishBase64(message)).toString('utf-8');
            return res.replace(/\0/g, '');
        } catch {
            return input;
        }
    }
}
