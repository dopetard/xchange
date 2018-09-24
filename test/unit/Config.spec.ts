import { expect, assert } from 'chai';
import { argv } from 'yargs';
import Config from '../../lib/Config';
import { deepMerge } from '../../lib/Utils';

const config = new Config();

describe('Config', () => {
  const cliInput = argv;

  delete cliInput._;
  delete cliInput.version;
  delete cliInput.help;
  delete cliInput.$0;
  delete cliInput.r;

  const ops = {
    configPath: '',
    walletPath: '',
    logPath: '',
    walliDir: '',
    logLevel: '',
    grpc: {
      host: '127.0.0.1',
      port: 9000,
    },
    btcd: {
      host: '127.0.0.1',
      port: 18334,
      rpcuser: '',
      rpcpass: '',
      configPath: '',
      certPath: '',
      rpclimituser: 'limituser',
      rpclimitpass: 'limituser',
      testnet: '1',
      datadir: 'F:\\testnet',
    },
    lnd: {
      host: '127.0.0.1',
      port: 10009,
      certPath: '',
      macaroonPath: '',
      configPath: '',
    },
  };
  deepMerge(cliInput, ops);

  it('should return object', () => {
    expect(config.load(argv)).to.be.an('object');
  });

  it('should have required keys', () => {
    expect(config.load(argv)).contains.all.keys(
      'configPath',
      'logPath',
      'walliDir',
      'logLevel',
      'grpc',
      'btcd',
      'lnd',
      );
  });

  it('should override all options from cli', () => {
    expect(config.load(cliInput)).to.deep.include(ops);
  });
});
