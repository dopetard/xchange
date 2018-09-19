import os from 'os';
import path from 'path';
import fs from 'fs';
import toml from 'toml';
import ini from 'ini';
import { Arguments } from 'yargs';
import { deepMerge, capitalizeFirstLetter, resolveHome } from './Utils';
import BtcdClient, { BtcdConfig } from './chain/BtcdClient';
import LndClient, { LndConfig } from './lightning/LndClient';
import { GrpcConfig } from './grpc/GrpcServer';
import { errors } from './consts/errors';

type SerivceConfigOption = {
  configPath: string;
};

type ConfigType = {
  configPath: string;
  logPath: string;
  logLevel: string;
  grpc: GrpcConfig;
  btcd: BtcdConfig & SerivceConfigOption;
  lnd: LndConfig & SerivceConfigOption;
};

class Config {
  private config: ConfigType;

  private walliDir: string;
  private btcdDir: string;
  private lndDir: string;

  /**
   * The constructor sets the default values
   */
  constructor() {
    this.walliDir = this.getServiceDataDir('walli');
    this.btcdDir = this.getServiceDataDir('btcd');
    this.lndDir = this.getServiceDataDir('lnd');

    this.config = {
      configPath: path.join(this.walliDir, 'walli.conf'),
      logPath: path.join(this.walliDir, 'walli.log'),
      logLevel: this.getDefaultLogLevel(),
      grpc: {
        host: '127.0.0.1',
        port: 9000,
      },
      btcd: {
        host: '127.0.0.1',
        port: 18334,
        user: '',
        password: '',
        configPath: path.join(this.btcdDir, 'btcd.conf'),
      },
      lnd: {
        host: '127.0.0.1',
        port: 10009,
        certPath: path.join(this.lndDir, 'tls.cert'),
        // The macaroon for the Bitcoin testnet is hardcoded for now
        macaroonPath: path.join(this.lndDir, 'data', 'chain', 'bitcoin', 'testnet', 'admin.macaroon'),
        configPath: path.join(this.lndDir, 'lnd.conf'),
      },
    };
  }

  // TODO: verify logLevel exists; depends on Logger.ts:8
  /**
   * This loads arguments specified by the user either from a TOML config file or from command line arguments
   */
  public load = (args: Arguments): ConfigType => {
    const walliConfigFile = this.resolveConfigPath(args.configPath, this.config.configPath);

    if (fs.existsSync(walliConfigFile)) {
      try {
        const walliToml = fs.readFileSync(walliConfigFile, 'utf-8');
        const walliConfig = toml.parse(walliToml);
        deepMerge(this.config, walliConfig);
      } catch (error) {
        throw errors.COULD_NOT_PARSE_CONFIG('walli', error);
      }
    }

    const btcdConfigFile = args.btcd ? this.resolveConfigPath(args.btcd.configPath, this.config.btcd.configPath) : this.config.btcd.configPath;
    const lndConfigFile = args.lnd ? this.resolveConfigPath(args.lnd.configPath, this.config.lnd.configPath) : this.config.lnd.configPath;

    this.parseIniConfig(
      btcdConfigFile,
      this.config.btcd,
      BtcdClient.serviceName,
    );

    this.parseIniConfig(
      lndConfigFile,
      this.config.lnd,
      LndClient.serviceName,
    );

    if (args) {
      deepMerge(this, args);
    }

    return this.config;
  }

  private parseIniConfig = (filename: string, mergeTarget: any, configType: string) => {
    if (fs.existsSync(filename)) {
      try {
        const config = ini.parse(filename);
        deepMerge(mergeTarget, config);

        if (config.listen) {
          const split = config.listen.split(':');

          mergeTarget.host = split[0];
          mergeTarget.port = split[1];
        }
      } catch (error) {
        throw errors.COULD_NOT_PARSE_CONFIG(configType, error);
      }
    }
  }

  private resolveConfigPath = (configPath: string, fallback: string) => {
    return configPath ? resolveHome(configPath) : fallback;
  }

  // TODO: support for Geth/Parity and Raiden
  private getServiceDataDir = (service: string) => {
    const homeDir = this.getSystemHomeDir();
    const serviceDir = service.toLowerCase();

    switch (os.platform()) {
      case 'win32':
      case 'darwin':
        return path.join(homeDir, capitalizeFirstLetter(serviceDir));

      default: return path.join(homeDir, `.${serviceDir}`);
    }
  }

  private getSystemHomeDir = (): string => {
    switch (os.platform()) {
      case 'win32': return process.env.LOCALAPPDATA!;
      case 'darwin': return path.join(process.env.HOME!, 'Library', 'Application Support');
      default: return process.env.HOME!;
    }
  }

  private getDefaultLogLevel = (): string => {
    return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  }
}

export default Config;
export { ConfigType };
