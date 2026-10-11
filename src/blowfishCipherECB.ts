import { Cipher } from './cipher';
import { Blowfish } from './blowfish';
import * as utils from './utils';

export class BlowfishCipherECB implements Cipher {
    constructor(private readonly key: string) {}

    encrypt(input: string): string {
        let result = '';
        const bf = new Blowfish(Buffer.from(this.key));
        const data = bf.encryptECB(utils.padBuffer(Buffer.from(input, 'utf8'), 8));
        for (let i = 0; i < data.length; i += 8) {
            result += utils.toBlowfishBase64(data.subarray(i, i + 8));
        }
        return `+OK ${result}`;
    }
}
