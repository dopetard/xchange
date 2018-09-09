import os from 'os';

class Config {
  private platform: NodeJS.Platform;
  private wallidir: string;

  constructor() {
    this.platform = os.platform();

    switch (this.platform){
      case 'linux': {
        const homeDir = process.env.HOME;
        this.wallidir = `${homeDir}/.walli/`;
        break;
      }

      case 'darwin': {
        const homeDir = process.env.HOME;
        this.wallidir = `${homeDir}/.walli/`;
        break;
      }

      default: /* WIN32 */ {
        const homeDir = process.env.LOCALAPPDATA;
        this.wallidir = `${homeDir}/.walli/`;
        break;
      }
    }
  }

  public info() {
    console.log(this.wallidir);
  }
}

export default Config;
