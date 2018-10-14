import { networks } from 'bitcoinjs-lib';

const litecoinPrefix = '\\x19Litecoin Signed Message:\n';

const testnetBip32 = {
  private: 0x019D9CFE,
  public: 0x019DA462,
};

const Networks = {
  bitcoinMainnet: networks.bitcoin,
  bitcoinTestnet: networks.testnet,
  bitcoinRegtest: {
    messagePrefix: '\\x18Bitcoin Signed Message:\n',
    bip32: testnetBip32,
    bech32: 'bcrt',
    scriptHash: 0xc4,
    pubKeyHash: 0x6f,
    wif: 0xef,
  },
  litecoinMainnet: {
    messagePrefix: litecoinPrefix,
    bip32: {
      private: 0x019d9cfe,
      public: 0x019da462,
    },
    bech32: 'ltc',
    scriptHash: 0x32,
    pubKeyHash: 0x30,
    wif: 0xb0,
  },
  litecoinTestnet: {
    messagePrefix: litecoinPrefix,
    bip32: testnetBip32,
    bech32: 'tltc',
    scriptHash: 0x3a,
    pubKeyHash: 0x6f,
    wif: 0xef,
  },
  litecoinRegtest: {
    messagePrefix: litecoinPrefix,
    bip32: testnetBip32,
    bech32: 'tltc',
    scriptHash: 0xc4,
    pubKeyHash: 0x6f,
    wif: 0xef,
  },
};

export default Networks;
