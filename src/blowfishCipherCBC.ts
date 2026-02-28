import { Cipher } from './cipher';
import { Blowfish } from './blowfish';
import * as utils from './utils';

export class BlowfishCipherCBC implements Cipher {
    constructor(private readonly key: string) {}

    encrypt(input: string): string {
        const paddedInput = utils.padBuffer(Buffer.from(input, 'utf8'), 8);
        // IV is intentionally derived from the first 8 bytes of plaintext for
        // compatibility with the FiSH IRC encryption protocol. This is a
        // protocol-level requirement, not a security oversight.
        const IV = Buffer.from(paddedInput.subarray(0, 8));
        const bf = new Blowfish(Buffer.from(this.key));
        const encrypted = Buffer.concat([IV, bf.encryptCBC(paddedInput, IV)]).toString('base64');
        return `+OK *${encrypted}`;
    }
}
