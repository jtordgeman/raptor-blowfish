import { Fish } from '../index';

test('ecb encode', () => {
    const fish = new Fish('testMyKey');
    expect(fish.encrypt('hello world')).toBe('+OK vmyOX/qmteO/0DO15/KpSWX/');
});
