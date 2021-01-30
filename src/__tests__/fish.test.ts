import { Fish } from '../index';

test('ecb encrypt', () => {
    const enc = Fish.createCipher('IHeartBritney');
    expect(enc.encrypt('I think I did it again')).toBe('+OK VIzh1.xk37m/evV2m.CZIU3YISR4D/Pet/2Y');
});

test('ecb decrypt', () => {
    const dec = Fish.createDecipher('IHeartBritney');
    expect(dec.decrypt('+OK u.O.cY/fJblY6PrR7Zr5rI1Zb4Yic/AeJtZZT.RcPYxKf3sYWP.C5/uq7dlZViV0NYKi4J2.')).toBe(
        "I made you believe we're more than just friends",
    );
});

test('cbc encrypt/decrypt', () => {
    const enc = Fish.createCipher('cbc:IHeartBritney');
    const encrypted = enc.encrypt('Hit me babt one more time!');
    const dec = Fish.createDecipher('cbc:IHeartBritney');
    expect(dec.decrypt(encrypted)).toBe('Hit me babt one more time!');
    const encrypted2 = enc.encrypt('Oops! I think I did it again');
    expect(dec.decrypt(encrypted2)).toBe('Oops! I think I did it again');
});
