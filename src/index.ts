import * as crypto from 'crypto';

const B64 = './0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

enum algorithms {
    ecb = 'bf-ecb',
    cbc = 'bf-cbc',
}

export class Fish {
    private useCBC: boolean = false;
    private cipher: crypto.Cipher | undefined;
    private decipher: crypto.Decipher | undefined;

    constructor(private key: string) {
        if (key.startsWith('cbc:')) {
            this.useCBC = true;
            this.key = this.key.substring(4);
        } else {
            this.cipher = crypto.createCipheriv(algorithms.ecb, Buffer.from(key), '');
            this.cipher.setAutoPadding(false);
            this.decipher = crypto.createDecipheriv(algorithms.ecb, Buffer.from(key), '');
            this.decipher.setAutoPadding(false);
        }
    }
    private toBase64(buf: Buffer): string {
        const bigShifter = BigInt(63);
        const smallShifter = BigInt(6);

        let result = '';
        let leftNumber = 0;
        let rightNumber = 0;
        let counter = 0;

        for (let i = 3; i >= 0; i--) {
            leftNumber += buf[counter] << (8 * i);
            rightNumber += buf[counter + 4] << (8 * i);
            counter++;
        }

        let left: bigint = BigInt(leftNumber);
        let right: bigint = BigInt(rightNumber);

        for (let i = 0; i < 6; i++) {
            const n = right & bigShifter;
            right = right >> smallShifter;
            result += B64[Number(n)];
        }

        for (let i = 0; i < 6; i++) {
            const n = left & bigShifter;
            left = left >> smallShifter;
            result += B64[Number(n)];
        }

        return result;
    }
    private pad(input: string, length: number = 8): string {
        if (input.length % length > 0) {
            let padBytes: number = length - (input.length % length);
            for (let x = 1; x <= padBytes; x++) {
                input += String.fromCharCode(0);
            }
        }

        return input;
    }
    private encryptECB(input: string): string {
        let result = '';
        const data = Buffer.concat([this.cipher!.update(this.pad(input), 'utf-8'), this.cipher!.final()]);
        for (let i = 0; i < data.length; i += 8) {
            result += this.toBase64(data.slice(i, i + 8));
        }
        return `+OK ${result}`;
    }
    encrypt(input: string): string {
        if (this.useCBC) {
            return input;
        } else {
            return this.encryptECB(input);
        }
    }
}
