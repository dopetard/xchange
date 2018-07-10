type XudConfig = {
  host: string,
  port: number,
};

type DbConfig = {
  database: string,
  host: string,
  port: number,
  username: string,
};

type Config = {
  xud: XudConfig,
  db: DbConfig,
};

class Walli {

  constructor(private config: Config) {
    console.log(config);
  }

  public start = () => {};

}

export default Walli;
