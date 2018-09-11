import os from 'os';
import path from 'path';
import fs from 'fs';
import toml from 'toml';
import ini from 'ini';
import { deepMerge } from './Utils';
import { RpcConfig } from './rpc/RpcClient';

class Config {
  public config: string;
  public btcdconfig: string;
  public logfile: string;
  public loglevel: string;
  public rpc: RpcConfig;
  private btcdDir: string;

  constructor() {
    const platform = os.platform();

    switch (platform){
      case 'win32': {
        const localDir = process.env.LOCALAPPDATA;
        this.btcdDir = `${localDir}/Btcd/`;
        break;
      }
      case 'darwin': {
        const localDir = process.env.HOME;
        this.btcdDir = `${localDir}/Library/Application Support/Btcd`;
        break;
      }
      default: {
        const localDir = process.env.HOME;
        this.btcdDir = `${localDir}/.btcd/`;
        break;
      }
    }

    /* btcd rpc info */
    this.rpc = {
      port: 18334,
      host: '127.0.0.1',
      user: 'user',
      password: 'usr',
    };

    this.logfile = 'walli.log';
    this.btcdconfig = 'btcd.conf';
    this.config = 'walli.conf';
    this.loglevel = 'verbose';
  }

  public load = (args?: { [argName: string]: any }) => {
    let btcdPath;
    let walliPath;

    if (args) {
      btcdPath = args.btcdconfig ? path.join(args.btcdconfig) : path.join(this.btcdDir, this.btcdconfig);
      walliPath = args.config ? path.join(args.config) : path.join(__dirname, '../', this.config);
    } else {
      btcdPath = path.join(this.btcdDir, this.btcdconfig);
      walliPath = path.join(__dirname, '../', this.config);
    }

    if (fs.existsSync(btcdPath)) {
      deepMerge(this.rpc, this.loadBtcdRpcConfig(btcdPath));
    }

    if (fs.existsSync(walliPath)) {
      const walliTOML = fs.readFileSync(walliPath, 'utf-8');

      try {
        const confFile = toml.parse(walliTOML);
        deepMerge(this, confFile);
      } catch (e) {
        throw new Error('Could not parse BTCD config. Using default values');
      }
    }

    if (args) {
      deepMerge(this, args);
    }

    return this;
  }

  private loadBtcdRpcConfig = (path: string): RpcConfig => {
    const config = ini.parse(fs.readFileSync(path, 'utf-8'))['Application Options'];
    const listen = config.listen ? config.listen.split(':') : [this.rpc.host, this.rpc.port];
    return ({
      host: listen[0],
      port: listen[1],
      user: config.rpcuser,
      password: config.rpcpass,
    });
  }
}

export default Config;
