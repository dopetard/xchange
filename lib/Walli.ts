import Logger from './Logger';
import DB, { DBConfig } from './db/DB';
import XudClient, { XudClientConfig } from './xudclient/XudClient';
import UserManager from './users/UserManager';
import API, { APIConfig } from './api/API';
import HistoryManager from './history/HistoryManager';

type Config = {
  logfile: string,
  db: DBConfig,
  xud: XudClientConfig,
  api: APIConfig,
};

class Walli {

  private logger: Logger;

  constructor(private config: Config) {
    this.logger = new Logger(config.logfile);
  }

  public start = async () => {
    const db = new DB(this.config.db, this.logger);
    await  db.init();

    // const xudClient = new XudClient(this.config.xud, this.logger);

    const historyManager = new HistoryManager(db.models);
    await historyManager.init();
    await historyManager.initHistory('BTC', 'USD');

    /* const userManager = new UserManager({
      db,
      xudClient,
      historyManager,
      logger: this.logger,
    });
    await userManager.init();

    const api = new API(this.config.api, userManager, this.logger);
    api.init();*/
  }
}

export default Walli;
