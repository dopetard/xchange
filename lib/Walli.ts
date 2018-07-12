import DB, { DBConfig } from './db/DB';
import UserManager from './users/UserManager';

type XudConfig = {
  host: string,
  port: number,
};

type Config = {
  xud: XudConfig,
  db: DBConfig,
};

class Walli {

  private db!: DB;
  private userManager!: UserManager;

  constructor(private config: Config) {}

  public start = async () => {
    this.db = new DB(this.config.db);
    await this.db.init();

    this.userManager = new UserManager(this.db);
    await this.userManager.init();

    this.userManager.updateBalance('c11f6cf0-8520-11e8-8d67-73acf1b3ad86', 'BTC', -5);
  }
}

export default Walli;
