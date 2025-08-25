import { packages } from './packages.js';

describe('packages', () => {
  it('should work', () => {
    expect(packages()).toEqual('packages');
  });
});
