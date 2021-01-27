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
};
export const pad = (input: string, length: number = 8): string => {
    if (input.length % length > 0) {
        let padBytes: number = length - (input.length % length);
        for (let x = 1; x <= padBytes; x++) {
            input += String.fromCharCode(0);
        }
    }

    return input;
};

export const fromBlowfishBase64 = (input: string): Buffer => {
    let s = input;
    let pack: Buffer[] = [];

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

    let res = Buffer.concat(pack);
    return res;
};
