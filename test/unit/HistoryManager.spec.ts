import { expect } from 'chai';
import HistoryManager from '../../lib/history/HistoryManager';

const testData = require('./values/HistoryManagerData.json');

function compareArrays(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;

  for (const index of a) {
    if (a[index] !== b[index]) return false;
  }

  return true;
}

describe('HistoryManager.parseData', () => {
  it('should parse data correclty', () => {
    const output = HistoryManager.parseData(testData.data);
    expect(compareArrays(output, testData.expectedOutput)).to.be.true;
  });
});
