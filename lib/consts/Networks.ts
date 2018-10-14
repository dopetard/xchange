import { networks } from 'bitcoinjs-lib';

const litecoin = {
  messagePrefix: '\\x19Litecoin Signed Message:\n',
  bip32: {
    private: 27106558,
    public: 27108450,
  },
};

const Networks = {
  bitcoinMainnet: networks.bitcoin,
  bitcoinTestnet: networks.testnet,
  bitcoinRegtest: {
    messagePrefix: '\\x18Bitcoin Signed Message:\n',
    bip32: {
      private: 70615956,
      public: 70617039,
    },
    bech32: 'bcrt',
    scriptHash: 196,
    pubKeyHash: 111,
    wif: 239,
  },
  litecoinMainnet: {
    messagePrefix: litecoin.messagePrefix,
    bip32: litecoin.bip32,
    bech32: 'ltc',
    scriptHash: 50,
    pubKeyHash: 48,
    wif: 176,
  },
  litecoinTestnet: {
    messagePrefix: litecoin.messagePrefix,
    bip32: litecoin.bip32,
    bech32: 'tltc',
    scriptHash: 58,
    pubKeyHash: 111,
    wif: 239,
  },
  litecoinRegtest: {
    messagePrefix: litecoin.messagePrefix,
    bip32: litecoin.bip32,
    bech32: 'tltc',
    scriptHash: 58,
    pubKeyHash: 111,
    wif: 239,
  },
};

export default Networks;
