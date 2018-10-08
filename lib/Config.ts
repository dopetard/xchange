import os from 'os';
import path from 'path';
import fs from 'fs';
import toml from 'toml';
import ini from 'ini';
import { Arguments } from 'yargs';
import { deepMerge, capitalizeFirstLetter, resolveHome, splitListen } from './Utils';
import { RpcConfig } from './RpcClient';
import BtcdClient from './chain/BtcdClient';
import LtcdClient from './chain/LtcdClient';
import LndClient, { LndConfig } from './lightning/LndClient';
import { GrpcConfig } from './grpc/GrpcServer';
import Errors from './consts/Errors';

type ServiceConfigOption = {
  configPath: string;
};

type ConfigType = {
  walliDir: string;
  configPath: string;
  logPath: string;
  logLevel: string;
  walletPath: string;
  grpc: GrpcConfig;
  btcd: RpcConfig & ServiceConfigOption;
  ltcd: RpcConfig & ServiceConfigOption;
  lnd: LndConfig & ServiceConfigOption;
};

class Config {
  private config: ConfigType;

  private walliDir: string;
  private btcdDir: string;
  private ltcdDir: string;
  private lndDir: string;

  /**
   * The constructor sets the default values
   */
  constructor() {
    this.walliDir = this.getServiceDataDir('walli');
    this.btcdDir = this.getServiceDataDir('btcd');
    this.ltcdDir = this.getServiceDataDir('ltcd');
    this.lndDir = this.getServiceDataDir('lnd');

    const { configPath, walletPath, logPath } = this.getWalliDirPaths(this.walliDir);

    this.config = {
      configPath,
      walletPath,
      logPath,
      walliDir: this.walliDir,
      logLevel: this.getDefaultLogLevel(),
      grpc: {
        host: '127.0.0.1',
        port: 9000,
      },
      btcd: {
        host: '127.0.0.1',
        port: 18334,
        rpcuser: '',
        rpcpass: '',
        configPath: path.join(this.btcdDir, 'btcd.conf'),
        certPath: path.join(this.btcdDir, 'rpc.cert'),
      },
      ltcd: {
        host: '127.0.0.1',
        port: 19334,
        rpcuser: '',
        rpcpass: '',
        configPath: path.join(this.ltcdDir, 'btcd.conf'),
        certPath: path.join(this.ltcdDir, 'rpc.cert'),
      },
      lnd: {
        host: '127.0.0.1',
        port: 10009,
        certPath: path.join(this.lndDir, 'tls.cert'),
        // The macaroon for the Bitcoin testnet is hardcoded for now
        macaroonPath: path.join(this.lndDir, 'data', 'chain', 'bitcoin', 'simnet', 'admin.macaroon'),
        configPath: path.join(this.lndDir, 'lnd.conf'),
      },
    };
  }

  // TODO: verify logLevel exists; depends on Logger.ts:8
  /**
   * This loads arguments specified by the user either from a TOML config file or from command line arguments
   */
  public load = (args: Arguments): ConfigType => {
    if (args && args.walliDir) {
      this.config.walliDir = resolveHome(args.walliDir);
      deepMerge(this.config, this.getWalliDirPaths(this.config.walliDir));
    }

    const walliConfigFile = this.resolveConfigPath(args.configPath, this.config.configPath);

    if (fs.existsSync(walliConfigFile)) {
      try {
        const walliToml = fs.readFileSync(walliConfigFile, 'utf-8');
        const walliConfig = toml.parse(walliToml);
        deepMerge(this.config, walliConfig);
      } catch (error) {
        throw Errors.COULD_NOT_PARSE_CONFIG('walli', error);
      }
    }

    if (!fs.existsSync(this.config.walliDir)) {
      fs.mkdirSync(this.config.walliDir);
    }

    const btcdConfigFile = args.btcd ? this.resolveConfigPath(args.btcd.configPath, this.config.btcd.configPath) : this.config.btcd.configPath;
    const ltcdConfigFile = args.ltcd ? this.resolveConfigPath(args.ltcd.configPath, this.config.ltcd.configPath) : this.config.ltcd.configPath;
    const lndConfigFile = args.lnd ? this.resolveConfigPath(args.lnd.configPath, this.config.lnd.configPath) : this.config.lnd.configPath;

    this.parseIniConfig(
      btcdConfigFile,
      this.config.btcd,
      BtcdClient.serviceName,
    );

    this.parseIniConfig(
      ltcdConfigFile,
      this.config.ltcd,
      LtcdClient.serviceName,
    );

    this.parseIniConfig(
      lndConfigFile,
      this.config.lnd,
      LndClient.serviceName,
    );

    if (args) {
      deepMerge(this.config, args);
    }
    return this.config;
  }

  private parseIniConfig = (filename: string, mergeTarget: any, configType: string) => {
    if (fs.existsSync(filename)) {
      try {
        const config = ini.parse(fs.readFileSync(filename, 'utf-8'))['Application Options'];

        switch (configType) {
          case 'LND':
            const configLND: LndConfig = config;
            deepMerge(mergeTarget, configLND);
            config.listen ? splitListen(mergeTarget, config.listen) : undefined;
            break;
          default:
            const configClient: RpcConfig = config;
            deepMerge(mergeTarget, configClient);
            config.listen ? splitListen(mergeTarget, config.listen) : undefined;
            break;
        }

      } catch (error) {
        throw Errors.COULD_NOT_PARSE_CONFIG(configType, error);
      }
    }
  }

  private getWalliDirPaths = (walliDir: string): { configPath: string, walletPath: string, logPath: string } => {
    return {
      configPath: path.join(walliDir, 'walli.conf'),
      walletPath: path.join(walliDir, 'wallet.dat'),
      logPath: path.join(walliDir, 'walli.log'),
    };
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
