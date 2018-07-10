import DB, { DBConfig } from './db/DB';
import UserRepository from './users/UserRepository';

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
  private userRepo!: UserRepository;

  constructor(private config: Config) {}

  public start = async () => {
    this.db = new DB(this.config.db);
    await this.db.init();

    this.userRepo = new UserRepository(this.db);
  }

}

export default Walli;
