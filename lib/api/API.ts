import express from 'express';
import bodyParser from 'body-parser';
import Logger from '../Logger';
import UserManager from '../users/UserManager';
import { registerRoutes } from './Routes';

type APIConfig = {
  host: string,
  port: number,
};

class API {

  private app: express.Application;

  constructor(private apiConfig: APIConfig, userManager: UserManager, private logger: Logger) {
    this.app = express();
    this.app.use(bodyParser.json());

    registerRoutes(this.app, userManager);
  }

  public init = () => {
    this.app.listen(this.apiConfig.port, this.apiConfig.host, () => {
      this.logger.info(`API server listening to ${this.apiConfig.host}:${this.apiConfig.port}`);
    });
  }

}

export default API;
export { APIConfig };
