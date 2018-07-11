import DB, { DBConfig } from './db/DB';
import DBRepository from './db/DBRepo';

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
  private dbRepo!: DBRepository;

  constructor(private config: Config) {}

  public start = async () => {
    this.db = new DB(this.config.db);
    await this.db.init();

    this.dbRepo = new DBRepository(this.db);
  }
}

export default Walli;
