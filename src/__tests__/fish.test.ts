import { Fish } from '../index';

test('ecb encode', () => {
    const enc = Fish.createCipher('testMyKey');
    expect(enc.encrypt('hello world')).toBe('+OK vmyOX/qmteO/0DO15/KpSWX/');
});
