import { expect, assert } from 'chai';
import { argv } from 'yargs';
import Config from '../../lib/Config';

describe('Config.load() returns proper params', () => {
  it('has required keys', () => {
    delete argv._;
    delete argv.version;
    delete argv.help;
    delete argv.$0;

    const config = new Config().load(argv);
    expect(config).to.be.an('object').that.contains.all.keys(
      'configPath',
      'logPath',
      'logLevel',
      'grpc',
      'btcd',
      'lnd',
      );
  });
});
