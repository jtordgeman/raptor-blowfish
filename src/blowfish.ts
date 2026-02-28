import { INITIAL_P, INITIAL_S } from './blowfishConstants';

export class Blowfish {
    private P: number[];
    private S: number[][];

    constructor(key: Buffer) {
        this.P = Array.from(INITIAL_P);
        this.S = INITIAL_S.map((box) => Array.from(box));

        // XOR key bytes into P-array
        const keyLen = key.length;
        let ki = 0;
        for (let i = 0; i < 18; i++) {
            let data = 0;
            for (let k = 0; k < 4; k++) {
                data = ((data << 8) | key[ki % keyLen]) >>> 0;
                ki++;
            }
            this.P[i] = (this.P[i] ^ data) >>> 0;
        }

        // Encrypt-and-replace all P and S entries
        const buf = Buffer.alloc(8, 0);
        for (let i = 0; i < 18; i += 2) {
            this.encryptBlock(buf, 0);
            this.P[i] = buf.readUInt32BE(0);
            this.P[i + 1] = buf.readUInt32BE(4);
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 256; j += 2) {
                this.encryptBlock(buf, 0);
                this.S[i][j] = buf.readUInt32BE(0);
                this.S[i][j + 1] = buf.readUInt32BE(4);
            }
        }
    }

    private F(x: number): number {
        const a = (x >>> 24) & 0xff;
        const b = (x >>> 16) & 0xff;
        const c = (x >>> 8) & 0xff;
        const d = x & 0xff;
        let y = (this.S[0][a] + this.S[1][b]) >>> 0;
        y = (y ^ this.S[2][c]) >>> 0;
        y = (y + this.S[3][d]) >>> 0;
        return y;
    }

    encryptBlock(buf: Buffer, offset: number): void {
        let L = buf.readUInt32BE(offset);
        let R = buf.readUInt32BE(offset + 4);

        for (let i = 0; i < 16; i += 2) {
            L = (L ^ this.P[i]) >>> 0;
            R = (R ^ this.F(L)) >>> 0;
            R = (R ^ this.P[i + 1]) >>> 0;
            L = (L ^ this.F(R)) >>> 0;
        }

        L = (L ^ this.P[16]) >>> 0;
        R = (R ^ this.P[17]) >>> 0;

        buf.writeUInt32BE(R, offset);
        buf.writeUInt32BE(L, offset + 4);
    }

    decryptBlock(buf: Buffer, offset: number): void {
        let L = buf.readUInt32BE(offset);
        let R = buf.readUInt32BE(offset + 4);

        for (let i = 16; i > 0; i -= 2) {
            L = (L ^ this.P[i + 1]) >>> 0;
            R = (R ^ this.F(L)) >>> 0;
            R = (R ^ this.P[i]) >>> 0;
            L = (L ^ this.F(R)) >>> 0;
        }

        L = (L ^ this.P[1]) >>> 0;
        R = (R ^ this.P[0]) >>> 0;

        buf.writeUInt32BE(R, offset);
        buf.writeUInt32BE(L, offset + 4);
    }

    encryptECB(data: Buffer): Buffer {
        const out = Buffer.from(data);
        for (let i = 0; i < out.length; i += 8) {
            this.encryptBlock(out, i);
        }
        return out;
    }

    decryptECB(data: Buffer): Buffer {
        const out = Buffer.from(data);
        for (let i = 0; i < out.length; i += 8) {
            this.decryptBlock(out, i);
        }
        return out;
    }

    encryptCBC(data: Buffer, iv: Buffer): Buffer {
        const out = Buffer.from(data);
        let prev = Buffer.from(iv);
        for (let i = 0; i < out.length; i += 8) {
            for (let j = 0; j < 8; j++) {
                out[i + j] ^= prev[j];
            }
            this.encryptBlock(out, i);
            prev = out.subarray(i, i + 8);
        }
        return out;
    }

    decryptCBC(data: Buffer, iv: Buffer): Buffer {
        const out = Buffer.from(data);
        let prev = Buffer.from(iv);
        for (let i = 0; i < out.length; i += 8) {
            const block = Buffer.from(data.subarray(i, i + 8));
            this.decryptBlock(out, i);
            for (let j = 0; j < 8; j++) {
                out[i + j] ^= prev[j];
            }
            prev = block;
        }
        return out;
    }
}
