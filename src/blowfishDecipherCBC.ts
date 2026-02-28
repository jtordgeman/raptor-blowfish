import { Decipher } from './decipher';
import { Blowfish } from './blowfish';
import * as utils from './utils';

export class BlowfishDecipherCBC implements Decipher {
    constructor(private readonly key: string) {}

    decrypt(input: string): string {
        if (!input.startsWith('+OK ') && !input.startsWith('mcps ')) {
            return input;
        }

        try {
            const starIndex = input.indexOf('*');
            if (starIndex === -1) {
                return input;
            }
            const message = input.slice(starIndex + 1);
            const decodedMessage = Buffer.from(message, 'base64');
            if (decodedMessage.length < 8) {
                return input;
            }
            const IV = decodedMessage.subarray(0, 8);
            const payload = utils.padBuffer(decodedMessage.subarray(8), 8);

            const bf = new Blowfish(Buffer.from(this.key));
            const result = bf.decryptCBC(payload, IV).toString('utf-8');
            return result.replace(/\0*$/g, '');
        } catch {
            return input;
        }
    }
}
