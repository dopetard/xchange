import { expect } from 'chai';
import * as utils from '../../lib/Utils';

describe('Utils', () => {
  const base = 'LTC';
  const quote = 'BTC';

  const pairId = `${base}/${quote}`;

  it('should concat pairId', () => {
    expect(utils.getPairId(base, quote)).to.be.equal(pairId);
  });

  it('should split pairId', () => {
    expect(utils.splitPairId(pairId)).to.be.deep.equal({
      base,
      quote,
    });
  });

  it('should check whether it is an object', () => {
    expect(utils.isObject({})).to.be.true;
    expect(utils.isObject([])).to.be.false;
  });

  it('should split derivation path', () => {
    const master = 'm';
    const sub = [0, 2, 543];
    const derivationPath = `${master}/${sub[0]}/${sub[1]}/${sub[2]}`;

    const result = utils.splitDerivationPath(derivationPath);

    expect(result.master).to.be.equal(master);
    expect(result.sub.length).to.be.equal(sub.length);

    sub.forEach((value, index) => {
      expect(result.sub[index]).to.be.equal(value);
    });
  });

  it('should get a hex encoded Buffers and strings', () => {
    const string = 'test';

    expect(utils.getHexBuffer(string)).to.be.deep.equal(Buffer.from(string, 'hex'));
    expect(utils.getHexString(Buffer.from(string))).to.be.equal(Buffer.from(string).toString('hex'));
  });
});
