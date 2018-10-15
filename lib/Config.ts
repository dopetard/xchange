import path from 'path';
import fs from 'fs';
import toml from 'toml';
import ini from 'ini';
import { Arguments } from 'yargs';
import { pki, md } from 'node-forge';
import { deepMerge, resolveHome, splitListen, getServiceDataDir } from './Utils';
import { RpcConfig } from './RpcClient';
import { LndConfig } from './lightning/LndClient';
import { GrpcConfig } from './grpc/GrpcServer';
import { XudConfig } from './xud/XudClient';
import Errors from './consts/Errors';

type ServiceConfigOption = {
  configpath: string;
};

type ConfigType = {
  wallidir: string;
  configpath: string;
  logpath: string;
  loglevel: string;
  walletpath: string;
  grpc: GrpcConfig;
  btcd: RpcConfig & ServiceConfigOption;
  ltcd: RpcConfig & ServiceConfigOption;
  xud: XudConfig & ServiceConfigOption;
  lnd: LndConfig & ServiceConfigOption;
};

class Config {
  private config: ConfigType;

  private walliDir: string;
  private btcdDir: string;
  private ltcdDir: string;
  private xudDir: string;
  private lndDir: string;

  /**
   * The constructor sets the default values
   */
  constructor() {
    this.walliDir = getServiceDataDir('walli');
    this.btcdDir = getServiceDataDir('btcd');
    this.ltcdDir = getServiceDataDir('ltcd');
    this.xudDir = getServiceDataDir('xud');
    this.lndDir = getServiceDataDir('lnd');

    const { configpath, walletpath, logpath } = this.getWalliDirPaths(this.walliDir);

    this.config = {
      configpath,
      walletpath,
      logpath,
      wallidir: this.walliDir,
      loglevel: this.getDefaultLogLevel(),
      grpc: {
        host: '127.0.0.1',
        port: 9000,
        certpath: path.join(this.walliDir, 'tls.cert'),
        keypath: path.join(this.walliDir, 'tls.key'),
      },
      btcd: {
        host: '127.0.0.1',
        port: 18334,
        rpcuser: 'user',
        rpcpass: 'user',
        configpath: path.join(this.btcdDir, 'btcd.conf'),
        certpath: path.join(this.btcdDir, 'rpc.cert'),
      },
      ltcd: {
        host: '127.0.0.1',
        port: 19334,
        rpcuser: 'user',
        rpcpass: 'user',
        configpath: path.join(this.ltcdDir, 'ltcd.conf'),
        certpath: path.join(this.ltcdDir, 'rpc.cert'),
      },
      xud: {
        host: '127.0.0.1',
        port: 8886,
        configpath: path.join(this.xudDir, 'xud.conf'),
        certpath: path.join(this.xudDir, 'tls.cert'),
      },
      lnd: {
        host: '127.0.0.1',
        port: 10009,
        certpath: path.join(this.lndDir, 'tls.cert'),
        // The macaroon for the Bitcoin testnet is hardcoded for now
        macaroonpath: path.join(this.lndDir, 'data', 'chain', 'bitcoin', 'testnet', 'admin.macaroon'),
        configpath: path.join(this.lndDir, 'lnd.conf'),
      },
    };
  }

  // TODO: verify logLevel exists; depends on Logger.ts:8
  /**
   * This loads arguments specified by the user either from a TOML config file or from command line arguments
   */
  public load = (args: Arguments): ConfigType => {
    if (!fs.existsSync(this.config.wallidir)) {
      fs.mkdirSync(this.config.wallidir);
    }

    if (args && args.walliDir) {
      this.config.wallidir = resolveHome(args.walliDir);
      deepMerge(this.config, this.getWalliDirPaths(this.config.wallidir));
    }

    const walliConfigFile = this.resolveConfigPath(args.configPath, this.config.configpath);

    if (fs.existsSync(walliConfigFile)) {
      this.parseTomlConfig(walliConfigFile, this.config);
    }

    const grpcCert = args.grpc ? args.grpc.certpath : this.config.grpc.certpath;
    const grpcKey = args.grpc ?  args.grpc.keypath : this.config.grpc.keypath;

    if (!fs.existsSync(grpcCert) && !fs.existsSync(grpcKey)) {
      this.generateCertificate(grpcCert, grpcKey);
    }

    const btcdConfigFile = args.btcd ? this.resolveConfigPath(args.btcd.configpath, this.config.btcd.configpath) : this.config.btcd.configpath;
    const ltcdConfigFile = args.ltcd ? this.resolveConfigPath(args.ltcd.configpath, this.config.ltcd.configpath) : this.config.ltcd.configpath;
    const lndConfigFile = args.lnd ? this.resolveConfigPath(args.lnd.configpath, this.config.lnd.configpath) : this.config.lnd.configpath;
    const xudConfigFile = args.xud ? this.resolveConfigPath(args.xud.configpath, this.config.xud.configpath) : this.config.xud.configpath;

    this.parseIniConfig(
      btcdConfigFile,
      this.config.btcd,
      false,
    );

    this.parseIniConfig(
      ltcdConfigFile,
      this.config.ltcd,
      false,
    );

    this.parseTomlConfig(
      xudConfigFile,
      this.config.xud,
    );

    this.parseIniConfig(
      lndConfigFile,
      this.config.lnd,
      true,
    );

    if (args) {
      deepMerge(this.config, args);
    }

    return this.config;
  }

  private parseIniConfig = (filename: string, mergeTarget: any, isLndConfig: boolean) => {
    if (fs.existsSync(filename)) {
      try {
        const config = ini.parse(fs.readFileSync(filename, 'utf-8'))['Application Options'];

        if (isLndConfig) {
          const configLND: LndConfig = config;
          if (config.listen) {
            const listen = splitListen(config.listen);
            mergeTarget.host = listen.host;
            mergeTarget.port = listen.port;
          }
          deepMerge(mergeTarget, configLND);
        } else {
          const configClient: RpcConfig = config;
          if (config.listen) {
            const listen = splitListen(config.listen);
            mergeTarget.host = listen.host;
            mergeTarget.port = listen.port;
          }
          deepMerge(mergeTarget, configClient);
        }
      } catch (error) {
        throw Errors.COULD_NOT_PARSE_CONFIG(filename, error);
      }
    }
  }

  private parseTomlConfig = (filename: string, mergeTarget: any) => {
    if (fs.existsSync(filename)) {
      try {
        const tomlFile = fs.readFileSync(filename, 'utf-8');
        const parsedConfig = toml.parse(tomlFile);
        deepMerge(mergeTarget, parsedConfig);
      } catch (error) {
        throw Errors.COULD_NOT_PARSE_CONFIG(filename, error);
      }
    }
  }
  private getWalliDirPaths = (walliDir: string): { configpath: string, walletpath: string, logpath: string } => {
    return {
      configpath: path.join(walliDir, 'walli.conf'),
      walletpath: path.join(walliDir, 'wallet.dat'),
      logpath: path.join(walliDir, 'walli.log'),
    };
  }

  private resolveConfigPath = (configPath: string, fallback: string) => {
    return configPath ? resolveHome(configPath) : fallback;
  }

  private getDefaultLogLevel = (): string => {
    return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
  }

  private generateCertificate = (tlsCertPath: string, tlsKeyPath: string): void => {
    const keys = pki.rsa.generateKeyPair(1024);
    const cert = pki.createCertificate();

    cert.publicKey = keys.publicKey;
    cert.serialNumber = String(Math.floor(Math.random() * 1024) + 1);

    const date = new Date();
    cert.validity.notBefore = date;
    cert.validity.notAfter = new Date(date.getFullYear() + 5, date.getMonth(), date.getDay());

    const attributes = [
      {
        name: 'organizationName',
        value: 'Walli autogenerated certificate',
      },
    ];

    cert.setSubject(attributes);
    cert.setIssuer(attributes);

    cert.setExtensions([
      {
        name: 'subjectAltName',
        altNames: [
          {
            type: 2,
            value: 'localhost',
          },
          {
            type: 7,
            ip: '127.0.0.1',
          },
        ],
      },
    ]);

    cert.sign(keys.privateKey, md.sha256.create());

    const certificate = pki.certificateToPem(cert);
    const privateKey = pki.privateKeyToPem(keys.privateKey);

    fs.writeFileSync(tlsCertPath, certificate);
    fs.writeFileSync(tlsKeyPath, privateKey);
  }
}

export default Config;
export { ConfigType };
