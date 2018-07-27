import uuidv1 from 'uuid/v1';
import Bluebird from 'bluebird';
import Sequelize, { Op } from 'sequelize';
import * as db from '../types/DB';
import DB, { Models } from '../db/DB';

class UserManagerRepository {

  private models: Models;
  private sequelize: Sequelize.Sequelize;

  constructor(db: DB) {
    this.models = db.models;
    this.sequelize = db.sequelize;
  }

  public addUser = (): Bluebird<db.UserInstance> => {
    return this.models.User.create({ id: uuidv1() });
  }

  public addBalance = (balance: db.BalanceFactory): Bluebird<db.BalanceInstance> => {
    return this.models.Balance.create(balance);
  }

  public addInvoice = (invoice: db.InvoiceFactory): Bluebird<db.InvoiceInstance> => {
    return this.models.Invoice.create(invoice);
  }

  public addCurrencies = (currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> => {
    return this.models.Currency.bulkCreate(currencies);
  }

  public updateUserBalance = async (user: string, currency: string, increasedAmount: number) => {
    const whereClause = {
      where: {
        user: {
          [Op.eq]: user,
        },
        currency: {
          [Op.eq]: currency,
        },
      },
    };
    const result = await this.models.Balance.findOne(whereClause);

    if (result !== null) {
      // Update the existing entry
      await this.models.Balance.update({ balance: this.sequelize.literal(`balance + ${increasedAmount}`) }, whereClause);
    } else {
      // Insert a new entry
      await this.addBalance({ user, currency, balance: increasedAmount });
    }
  }

  public deleteInvoice = (identifier: string) => {
    return this.models.Invoice.destroy({
      where: {
        identifier: { [Op.eq]: identifier },
      },
    });
  }

  public getInvoice = async (identifier: string): Promise<db.InvoiceInstance | null> => {
    return this.models.Invoice.find({
      where: {
        identifier: { [Op.eq]: identifier },
      },
      raw: true,
    });
  }

  public getBalance = async (user: string, currency: string): Promise<db.BalanceInstance | null> => {
    return this.models.Balance.find({
      where: {
        user: {
          [Op.eq]: user,
        },
        currency: {
          [Op.eq]: currency,
        },
      },
      raw: true,
    });
  }

  public getBalances = async (user: string): Promise<db.BalanceInstance[]> => {
    return this.models.Balance.findAll({
      where: {
        user: {
          [Op.eq]: user,
        },
      },
      raw: true,
    });
  }

  public getCurrencies = async (): Promise<db.CurrencyInstance[]> => {
    return this.models.Currency.findAll({ raw: true });
  }

  public getUsers = async (): Promise<db.UserInstance[]> => {
    return this.models.User.findAll({ raw: true });
  }
}

export default UserManagerRepository;
