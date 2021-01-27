export interface Cipher {
    encrypt(input: string): string;
}

export interface Decipher {
    decrypt(input: string): string;
}