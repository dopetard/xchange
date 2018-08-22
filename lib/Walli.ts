import Logger from './Logger';

type Config = {
  logfile: string,
};

class Walli {

  private logger: Logger;

  constructor(config: Config) {
    this.logger = new Logger(config.logfile);
  }

  public start = async () => {
    this.logger.info('test');
  }
}

export default Walli;
