import { Fish } from '../index';

test('ecb encrypt', () => {
    const enc = Fish.createCipher('testMyKey');
    expect(enc.encrypt('hello world')).toBe('+OK vmyOX/qmteO/0DO15/KpSWX/');
    expect(enc.encrypt('hit me baby one more time')).toBe('+OK r2XCRZD32fzZlOzTnYnMZYOYW9Aah/Msgw1.0uMgh.neylRZ');
});

test('ecb decrypt', () => {
    const dec = Fish.createDecipher('testMyKey');
    expect(dec.decrypt('+OK vmyOX/qmteO/0DO15/KpSWX/')).toBe('hello world');
    expect(dec.decrypt('+OK r2XCRZD32fzZlOzTnYnMZYOYW9Aah/Msgw1.0uMgh.neylRZ')).toBe('hit me baby one more time');
});
