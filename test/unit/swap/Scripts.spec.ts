import { expect } from 'chai';
import { getHexString } from '../../../lib/Utils';
import * as scripts from '../../../lib/swap/Scripts';

describe('Scripts', () => {
  const redeemScript = '00';

  it('should get P2WPKH output script', () => {
    const testData = {
      args: {
        hash: publicKeyHash,
      },
      result: '00140000000000000000000000000000000000000000',
    };

    expect(getHexString(scripts.p2wpkhOutput(testData.args.hash))).to.be.equal(testData.result);
  });

  it('should get P2WSH output script', () => {
    const testData = {
      args: {
        scriptHex: redeemScript,
      },
      result: '00206e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d',
    };

    expect(getHexString(scripts.p2wshOutput(testData.args.scriptHex))).to.be.equal(testData.result);
  });

  it('should get P2PKH output script', () => {
    const testData = {
      args: {
        hash: publicKeyHash,
      },
      result: '76a914000000000000000000000000000000000000000088ac',
    };

    expect(getHexString(scripts.p2pkhOutput(testData.args.hash))).to.be.equal(testData.result);
  });

  it('should get P2SH output script', () => {
    const testData = {
      args: {
        scriptHex: redeemScript,
      },
      result: 'a9149f7fd096d37ed2c0e3f7f0cfc924beef4ffceb6887',
    };

    expect(getHexString(scripts.p2shOutput(testData.args.scriptHex))).to.be.equal(testData.result);
  });

  it('should get P2SH nested P2WSH', () => {
    const testData =  {
      args: {
        scriptHex: redeemScript,
      },
      result: 'a91466a823e1ae9236a70fe7321f5b26b09ec422a37787',
    };

    expect(getHexString(scripts.p2shP2wshOutput(testData.args.scriptHex))).to.be.equal(testData.result);
  });
});

export const publicKeyHash = '0000000000000000000000000000000000000000';
