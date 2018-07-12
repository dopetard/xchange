import DB, { DBConfig } from './db/DB';
import XudClient, { XudClientConfig } from './xudclient/XudClient';
import UserManager from './users/UserManager';

type Config = {
  xud: XudClientConfig,
  db: DBConfig,
};

class Walli {

  private db!: DB;
  private userManager!: UserManager;
  private xudClient!: XudClient;

  constructor(private config: Config) {}

  public start = async () => {
    this.db = new DB(this.config.db);
    await this.db.init();

    this.userManager = new UserManager(this.db);
    await this.userManager.init();

    this.xudClient = new XudClient(this.config.xud);
    console.log(await this.xudClient.addInvoice(1, 'test'));
  }
}

export default Walli;
