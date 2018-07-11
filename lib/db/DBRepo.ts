import uuidv1 from 'uuid/v1';
import Bluebird from 'bluebird';
import * as db from '../types/DB';
import Db, { Models } from '../db/DB';

class DBRepository {

  private models: Models;

  constructor(db: Db) {
    this.models = db.models;
  }

  public addUser = (): Bluebird<db.UserInstance> => {
    return this.models.User.create({ id: uuidv1() });
  }

  public addCurrencies = (currencies: db.CurrencyFactory[]): Bluebird<db.CurrencyInstance[]> => {
    return this.models.Currency.bulkCreate(currencies);
  }

  public addInvoice = (invoice: db.InvoiceFactory) => {
    return this.models.Invoice.create(invoice);
  }

  public getCurrencies = async (): Promise<db.CurrencyInstance[]> => {
    return this.models.Currency.findAll({ raw: true });
  }

  public getUsers = async (): Promise<db.UserInstance[]> => {
    return this.models.User.findAll({ raw: true });
  }
}

export default DBRepository;
