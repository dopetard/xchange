import Sequelize from 'sequelize';
import path from 'path';
import fs from 'fs';
import * as db from '../types/DB';

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
  Invoice: Sequelize.Model<db.InvoiceInstance, db.InvoiceAttributes>,
};

class DB {
  public models: Models;

  private sequelize: Sequelize.Sequelize;

  constructor(private config: DBConfig) {
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
      console.log(`connected to database. host:${host} port:${port} database:${database}`);
    } catch (err) {
      if (DB.isDbDoesNotExistError(err)) {
        await this.createDatabase();
      } else {
        console.error('unable to connect to the database', err);
        throw err;
      }
    }
    const { User, Currency, Invoice } = this.models;

    await Promise.all([
      User.sync(),
      Currency.sync(),
    ]);
    await Invoice.sync();
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
      console.error('unable to create the database', err);
      throw err;
    }
  }
}

export default DB;
export { DBConfig, Models };
