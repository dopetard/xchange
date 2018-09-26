// tslint:disable:max-line-length
import { expect } from 'chai';
import { pkRefundSwap, pkHashRefundSwap } from '../../../lib/swap/Submarine';

describe('SubmarineSwaps', () => {
  const preimageHash = '53ada8e6de01c26ff43040887ba7b22bddce19f8658fd1ba00716ed79d15cd5e';
  const destinationPublicKey = '03f8109578aae1e5cfc497e466cf6ae6625497cd31886e87b2f4f54f3f0f46b539';
  const timeoutBlockHeight = 515924;

  it('should generate a redeem script with a public key refund path', () => {
    const testData = {
      args: {
        preimageHash,
        destinationPublicKey,
        timeoutBlockHeight,
        refundPublicKey: '03ec0c1e45b709d708cd376a6f2daf19ac27be229647780d592e27d7fb7efb207a',
      },
      result: 'a914e2ac8cb97af3d59b1c057db4b0c4f9aa12a9127387632103f8109578aae1e5cfc497e466cf6ae6625497cd31886e87b2f4f54f3f0f46b539670354df07b1752103ec0c1e45b709d708cd376a6f2daf19ac27be229647780d592e27d7fb7efb207a68ac',
    };

    expect(pkRefundSwap(
      testData.args.preimageHash,
      testData.args.destinationPublicKey,
      testData.args.refundPublicKey,
      testData.args.timeoutBlockHeight,
   )).to.be.equal(testData.result);
  });

  it('should generate a redeem script with a public key hash refund path', () => {
    const testData = {
      args: {
        preimageHash,
        destinationPublicKey,
        timeoutBlockHeight,
        refundPublicKeyHash: '10fd1a974109be99bdf95334f8b7625bda0e90be',
      },
      result: '76a914e2ac8cb97af3d59b1c057db4b0c4f9aa12a912738763752103f8109578aae1e5cfc497e466cf6ae6625497cd31886e87b2f4f54f3f0f46b539670354df07b17576a91410fd1a974109be99bdf95334f8b7625bda0e90be8868ac',
    };

    expect(pkHashRefundSwap(
      testData.args.preimageHash,
      testData.args.destinationPublicKey,
      testData.args.refundPublicKeyHash,
      testData.args.timeoutBlockHeight,
    )).to.be.equal(testData.result);
  });
});
