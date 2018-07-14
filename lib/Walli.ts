import Logger from './Logger';
import DB, { DBConfig } from './db/DB';
import XudClient, { XudClientConfig } from './xudclient/XudClient';
import UserManager from './users/UserManager';
import API, { APIConfig } from './api/API';

type Config = {
  logfile: string,
  db: DBConfig,
  xud: XudClientConfig,
  api: APIConfig,
};

class Walli {

  private logger: Logger;
  private db!: DB;
  private userManager!: UserManager;
  private xudClient!: XudClient;
  private api!: API;

  constructor(private config: Config) {
    this.logger = new Logger(config.logfile);
  }

  public start = async () => {
    this.db = new DB(this.config.db, this.logger);
    await this.db.init();

    this.xudClient = new XudClient(this.config.xud, this.logger);

    this.userManager = new UserManager(this.db, this.xudClient, this.logger);
    await this.userManager.init();

    this.api = new API(this.config.api, this.userManager, this.logger);
    this.api.init();
  }
}

export default Walli;
