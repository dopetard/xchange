import os from 'os';
import path from 'path';
import fs from 'fs';
import toml from 'toml';
import ini from 'ini';
import { Arguments } from 'yargs';
import { pki, md } from 'node-forge';
import { deepMerge, getServiceDataDir, resolveHome } from './Utils';
import BtcdClient, { BtcdConfig } from './chain/BtcdClient';
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
  btcd: BtcdConfig & ServiceConfigOption;
  lnd: LndConfig & ServiceConfigOption;
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
    this.walliDir = getServiceDataDir('walli');
    this.btcdDir = getServiceDataDir('btcd');
    this.lndDir = getServiceDataDir('lnd');

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
        certpath: path.join(this.walliDir, 'tls.cert'),
        keypath: path.join(this.walliDir, 'tls.key'),
      },
      btcd: {
        host: '127.0.0.1',
        port: 18334,
        user: '',
        password: '',
        configPath: path.join(this.btcdDir, 'btcd.conf'),
        certpath: path.join(this.btcdDir, 'rpc.cert'),
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

    const grpcCert = args.grpc ? args.grpc.certpath : this.config.grpc.certpath;
    const grpcKey = args.grpc ?  args.grpc.keypath : this.config.grpc.keypath;

    if (!fs.existsSync(grpcCert) && !fs.existsSync(grpcKey)) {
      this.generateCertificate(grpcCert, grpcKey);
    }

    if (!fs.existsSync(this.config.walliDir)) {
      fs.mkdirSync(this.config.walliDir);
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
      deepMerge(this.config, args);
    }

    return this.config;
  }

  private parseIniConfig = (filename: string, mergeTarget: any, configType: string) => {
    if (fs.existsSync(filename)) {
      try {
        const config = ini.parse(fs.readFileSync(filename, 'utf-8'));
        const { rpcuser, rpcpass, listen } = config['Application Options'];

        rpcuser ? mergeTarget.user = rpcuser : undefined;
        rpcpass ? mergeTarget.password = rpcpass : undefined;

        if (listen) {
          const split = listen.split(':');
          mergeTarget.host = split[0];
          mergeTarget.port = split[1];
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
        value: 'Walli certificate',
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
