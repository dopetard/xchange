import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import * as db from '../types/DB';
import Logger from '../Logger';

type DBConfig = {
  database?: string,
  host: string,
  port: number,
  username: string,
  password?: string,
};

type Models = {
  User: Sequelize.Model<db.UserInstance, db.UserAttributes>,
  Currency: Sequelize.Model<db.CurrencyInstance, db.CurrencyAttributes>,
  Balance: Sequelize.Model<db.BalanceInstance, db.BalanceAttributes>,
  Invoice: Sequelize.Model<db.InvoiceInstance, db.InvoiceAttributes>,
};

class DB {

  public models: Models;
  public sequelize: Sequelize.Sequelize;

  constructor(private config: DBConfig, private logger: Logger) {
    this.sequelize = this.createSequelizeInstance(config);
    this.models = this.loadModels();
  }

  private createSequelizeInstance = (config: DBConfig): Sequelize.Sequelize => {
    return new Sequelize({
      ...config,
      dialect: 'mysql',
      operatorsAliases: false,
      dialectOptions: {
        multipleStatements: true,
      },
    });
  }

  private loadModels(): Models {
    const models: { [index: string]: Sequelize.Model<any, any> } = {};
    const modelsFolder = path.join(__dirname, 'models');
    fs.readdirSync(modelsFolder)
      .filter(file => (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3).match(/.js|.ts/)))
      .forEach((file) => {
        const model = this.sequelize.import(path.join(modelsFolder, file));
        models[model.name] = model;
      });

    Object.keys(models).forEach((key) => {
      const model = models[key];
      if (model.associate) {
        model.associate(models);
      }
    });

    return <Models>models;
  }

  public init = async (): Promise<void> => {
    try {
      await this.sequelize.authenticate();
      const { host, port, database } = this.config;
      this.logger.info(`Connected to database. host:${host} port:${port} database:${database}`);
    } catch (err) {
      if (DB.isDbDoesNotExistError(err)) {
        await this.createDatabase();
      } else {
        this.logger.error(`Unable to connect to the database ${err}`);
        throw err;
      }
    }
    const { User, Currency, Balance, Invoice } = this.models;
    const options = { logging: this.logger.info };

    await Promise.all([
      User.sync(options),
      Currency.sync(options),
    ]);
    await Promise.all([
      Balance.sync(options),
      Invoice.sync(options),
    ]);
  }

  private static isDbDoesNotExistError(err: Error): boolean {
    return err instanceof Sequelize.ConnectionError && (<any>err).original.code === 'ER_BAD_DB_ERROR';
  }

  private createDatabase = async (): Promise<void> => {
    try {
      const { database, ...databaselessConfig } = this.config;
      const sequelize = this.createSequelizeInstance(databaselessConfig);
      await sequelize.authenticate();
      await sequelize.query(`CREATE DATABASE ${database} CHARACTER SET utf8 COLLATE utf8_general_ci;`);
      await sequelize.close();
    } catch (err) {
      this.logger.error('Unable to create the database');
      throw err;
    }
  }
}

export default DB;
export { DBConfig, Models };
