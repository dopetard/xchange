import { expect } from 'chai';
import { mock } from 'ts-mockito';
import { address, crypto } from 'bitcoinjs-lib';
import bip32 from 'bip32';
import bip39 from 'bip39';
import Networks from '../../../lib/consts/Networks';
import Wallet from '../../../lib/wallet/Wallet';
import ChainClient from '../../../lib/chain/ChainClient';
import { OutputType } from '../../../lib/consts/OutputType';
import { getPubKeyHashEncodeFuntion, getHexBuffer } from '../../../lib/Utils';

describe('Wallet', () => {
  const mnemonic = bip39.generateMnemonic();
  const masterNode = bip32.fromSeed(bip39.mnemonicToSeed(mnemonic));

  const derivationPath = 'm/0/0';
  let highestIndex = 21;

  const network = Networks.bitcoinRegtest;
  const chainClientMock = mock(ChainClient);

  const wallet = new Wallet(masterNode, derivationPath, highestIndex, network, chainClientMock);

  const incrementIndex = () => {
    highestIndex = highestIndex + 1;
  };

  const getKeysByIndex = (index: number) => {
    return masterNode.derivePath(`${derivationPath}/${index}`);
  };

  it('should get correct address from index', () => {
    const index = 1;

    expect(wallet.getKeysByIndex(index)).to.be.deep.equal(getKeysByIndex(index));
  });

  it('should get new keys', () => {
    incrementIndex();

    expect(wallet.getNewKeys()).to.be.deep.equal(getKeysByIndex(highestIndex));
    expect(wallet.highestUsedIndex).to.be.equal(highestIndex);
  });

  it('should encode an address', () => {
    const output = getHexBuffer('00147ca6c71979907c36d5d62f325d6d8104a8497445');
    const address = 'bcrt1q0jnvwxtejp7rd4wk9ue96mvpqj5yjaz9v7vte5';

    expect(wallet.encodeAddress(output)).to.be.equal(address);
  });

  it('should get a new address', () => {
    incrementIndex();

    const outputType = OutputType.Bech32;

    const keys = getKeysByIndex(highestIndex);
    const encodeFunction = getPubKeyHashEncodeFuntion(outputType);
    const outputScript = encodeFunction(crypto.hash160(keys.publicKey));
    const outputAddress = address.fromOutputScript(outputScript, network);

    expect(wallet.getNewAddress(outputType)).to.be.equal(outputAddress);
  });
});
