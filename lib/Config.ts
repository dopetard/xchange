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
      // TODO: Check if the btcd.conf file directory is proper for linux and mac
      case 'win32': {
        const localDir = process.env.LOCALAPPDATA;
        this.btcdDir = `${localDir}/Btcd/`;
        break;
      }
      case 'darwin': {
        const localDir = process.env.HOME;
        this.btcdDir = `${localDir}/Btcd/`;
        break;
      }
      default: /* WIN32 */ {
        const localDir = process.env.HOME;
        this.btcdDir = `${localDir}/Btcd/`;
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

  public load(args?: { [argName: string]: any }) {
    const walliPath = path.join(__dirname, '../', this.config);
    const btcdPath = path.join(this.btcdDir, this.btcdconfig);

    if (fs.existsSync(this.btcdDir)) {
      deepMerge(this.rpc, this.loadBtcdRpcConfig(btcdPath));
    }

    if (fs.existsSync(walliPath)) {
      const walliTOML = fs.readFileSync(walliPath, 'utf-8');

      try {
        const confFile = toml.parse(walliTOML);
        deepMerge(this, confFile);
      } catch (e) {
        throw new Error(`Error on line ${e.line}, cloumn ${e.cloumn}: ${e.message}`);
      }
    } else {
      fs.writeFileSync(this.config, '');
    }

    if (args) {
      deepMerge(this, args);
    }

    return this;
  }

  private loadBtcdRpcConfig (path: string): object {
    const config = ini.parse(fs.readFileSync(path, 'utf-8'));

    return ({
      user: config['Application Options'].rpcuser,
      password: config['Application Options'].rpcpass,
    });
  }

}

export default Config;
