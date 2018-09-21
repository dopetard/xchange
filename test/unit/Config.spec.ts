import { expect, assert } from 'chai';
import { argv } from 'yargs';
import Config from '../../lib/Config';
import { deepMerge } from '../../lib/Utils';
delete argv._;
delete argv.version;
delete argv.help;
delete argv.$0;

const config = new Config();

describe('Config.load() returns proper params', () => {
  it('Should return object', () => {
    expect(config.load(argv)).to.be.an('object');
  });

  it('Has required keys', () => {
    expect(config.load(argv)).contains.all.keys(
      'configPath',
      'logPath',
      'logLevel',
      'grpc',
      'btcd',
      'lnd',
      );
  });
});

describe('Input over ride order', () => {
  const cliInput = argv;
  deepMerge(cliInput, {
    grpc: { host: '128.0.0.1', port: 2000 },
  });

  it('Cli input overrides all input', () => {
    expect(config.load(cliInput)).to.deep.include({ grpc: { host: '128.0.0.1', port: 2000 } });
  });
});
