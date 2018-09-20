import { expect, assert } from 'chai';
import Config from '../../lib/Config';
import { isObject } from 'util';

describe('new Config()', () => {
  it('has required keys', () => {
    expect(new Config()).to.contain.keys('walliDir', 'btcdDir', 'lndDir', 'config');
  });
});
