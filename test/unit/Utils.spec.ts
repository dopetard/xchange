import { expect, assert } from 'chai';
import  * as Utils from '../../lib/Utils';
import { isObject } from 'util';

describe('getPairId', () => {
  it('returns base/quotes', () => {
    expect(Utils.getPairId('BTC', 'USD')).to.equal('BTC/USD');
  });
});

describe('splitPairId', () => {
  it('returns pair of ids from pairId string', () => {
    assert.typeOf(Utils.splitPairId('BTC/USD'), 'object');
    expect(Utils.splitPairId('BTC/USD')).to.have.all.keys('base', 'quote');
  });
});

describe('isObject', () => {
  it('checks if is object', () => {
    expect(isObject({})).to.be.true;
  });
});
