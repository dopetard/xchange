import { Network, networks } from 'bitcoinjs-lib';

const Networks: { [ name: string ]: Network } = {
  bitcoin_mainnet: networks.bitcoin,
  bitcoin_testnet: networks.testnet,
  bitcoin_regtest: {
    messagePrefix: '\\x18Bitcoin Signed Message:\n',
    bip32: {
      private: 70615956,
      public: 70617039,
    },
    bech32: 'tb',
    pubKeyHash: 111,
    scriptHash: 196,
    wif: 239,
  },
};

export default Networks;