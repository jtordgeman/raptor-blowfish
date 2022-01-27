const B64 = './0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const toBlowfishBase64 = (buf: Buffer): string => {
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

    let left = BigInt(leftNumber);
    let right = BigInt(rightNumber);

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
};

const padByBlockSize = (input: string, blockSize: number, overrideLength?: number): string => {
    const inputLength = overrideLength || input.length;
    const padBytes = blockSize - (inputLength % blockSize);
    for (let x = 1; x <= padBytes; x++) {
        input += String.fromCharCode(0);
    }
    return input;
};

export const pad = (input: string, len: number): string => {
    if (input.length % len > 0) {
        input = padByBlockSize(input, len);
    }

    return input;
};

export const padBuffer = (input: Buffer, len: number): Buffer => {
    if (input.length % len > 0) {
        const padding = padByBlockSize('', len, input.length);
        return Buffer.concat([input, Buffer.from(padding)]);
    }
    return input;
};

export const fromBlowfishBase64 = (input: string): Buffer => {
    let s = input;
    const pack: Buffer[] = [];

    while (s) {
        let left = BigInt(0);
        let right = BigInt(0);

        for (let i = 0; i < 6; i++) {
            right = right | BigInt(B64.indexOf(s[i]) << (i * 6));
            left = left | BigInt(B64.indexOf(s[i + 6]) << (i * 6));
        }

        const buffer = Buffer.alloc(8);
        buffer.writeUInt32BE(Number(BigInt.asUintN(32, left)));
        buffer.writeUInt32BE(Number(BigInt.asUintN(32, right)), 4);

        pack.push(buffer);

        s = s.substr(12);
    }

    return Buffer.concat(pack);
};
