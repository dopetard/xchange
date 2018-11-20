import { expect } from 'chai';
import { OutputType } from '../../../lib/proto/xchangerpc_pb';
import { estimateFee } from '../../../lib/wallet/FeeCalculator';

describe('FeeCalculator', () => {
  it('should estimate fee of PKH outputs and inputs correclty', () => {
    const allTypeArray = [
      { type: OutputType.BECH32 },
      { type: OutputType.COMPATIBILITY },
      { type: OutputType.LEGACY },
    ];

    const testData = {
      args: {
        satsPerVbyte: 1,
        inputs: allTypeArray,
        outputs: allTypeArray,
      },
      result: 413,
    };

    const result = estimateFee(testData.args.satsPerVbyte, testData.args.inputs, testData.args.outputs);
    expect(result).to.be.equal(testData.result);
  });
});
