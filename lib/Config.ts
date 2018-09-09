import os from 'os';
import path from 'path';
import fs from 'fs';
import toml from 'toml';
import { deepMerge } from './Utils';

class Config {
  public walliDir: string;
  public btcdDir: string;
  public logfile: string;
  public loglevel: string;
  public rpc: {
    port: number,
    host: string,
    user?: string,
    password?: string,
  };

  constructor() {
    const platform = os.platform();

    switch (platform){
      case 'linux': {
        const localDir = process.env.HOME;
        this.walliDir = `${localDir}/.walli/`;
        this.btcdDir = `${localDir}/Btcd/`;
        break;
      }
      case 'darwin': {
        const localDir = process.env.HOME;
        this.walliDir = `${localDir}/.walli/`;
        this.btcdDir = `${localDir}/Btcd/`;
        break;
      }
      default: /* WIN32 */ {
        const localDir = process.env.LOCALAPPDATA;
        this.walliDir = `${localDir}/Walli/`;
        this.btcdDir = `${localDir}/Btcd/`;
        break;
      }
    }

    /* btcd rpc info */
    this.rpc = {
      port: 18334,
      host: '127.0.0.1',
    };

    this.logfile = 'walli.log';

    this.loglevel = 'verbose';
  }

  public load(args?: { [argName: string]: any }) {

    const walliPath = path.join(this.walliDir, 'walli.conf');
    const btcdPath = path.join(this.btcdDir, 'btcd.conf');

    if (fs.existsSync(this.btcdDir)) {
      deepMerge(this.rpc, this.loadBtcdRpcConfig(btcdPath));
    }

    if (!fs.existsSync(this.walliDir)) {
      fs.mkdirSync(this.walliDir);

    } else if (fs.existsSync(walliPath)) {
      const walliTOML = fs.readFileSync(walliPath, 'utf-8');

      try {
        const confFile = toml.parse(walliTOML);
        deepMerge(this, confFile);
      } catch (e) {
        throw new Error(`Error on line ${e.line}, cloumn ${e.cloumn}: ${e.message}`);
      }
    }

    if (args) {
      deepMerge(this, args);
    }

    return this;
  }

  private loadBtcdRpcConfig (path: string): object {
    const config = {};
    const arr = fs.readFileSync(path);
    arr.toString()
      .split(/\r?\n/)
      .filter(x => x.includes('='))
      .map((x) => {
        const val = x.split('=');
        switch (val[0]) {
          case 'rpcpass':
            config['password'] = val[1];
            break;
          case 'rpcuser':
            config['user'] = val[1];
            break;
          default:
            break;
        }
      });
    return config;
  }

}

export default Config;
