import Bluebird from 'bluebird';
import assert from 'assert';
import DB from '../db/DB';
import * as db from '../types/DB';
import UserManagerRepository from './UserManagerRepository';
import XudClient from '../xudclient/XudClient';
import errors from './Errors';
import Logger from '../Logger';
import { isObject } from '../Utils';

class UserManager {

  private userRepo: UserManagerRepository;

  private currencies: string[] = [];
  private users: string[] = [];

  constructor(db: DB, private xudClient: XudClient, private logger: Logger) {
    this.userRepo = new UserManagerRepository(db);
  }

  public init = async () => {
    const currencies = await this.userRepo.getCurrencies();
    currencies.forEach((currency) => {
      this.currencies.push(currency.id);
    });
    const users = await this.userRepo.getUsers();
    users.forEach((user) => {
      this.users.push(user.id);
    });

    await this.subscribeInvoices();
  }

  public addUser = async (): Promise<string> => {
    const { id } = await this.userRepo.addUser();

    const promises: Bluebird<any>[] = [];
    this.currencies.forEach((currency) => {
      promises.push(this.userRepo.addBalance({
        currency,
        user: id,
        balance: 0,
      }));
    });
    await Promise.all(promises);

    return id;
  }

  public addCurrency = async (currency: string) => {
    await this.userRepo.addCurrencies([{ id: currency }]);
    this.currencies.push(currency);

    const promises: Bluebird<any>[] = [];
    this.users.forEach((user) => {
      promises.push(this.userRepo.addBalance({
        currency,
        user,
        balance: 0,
      }));
    });
    await Promise.all(promises);
  }

  public getInvoice = async (user: string, currency: string, amount: number, memo: string = ''): Promise<string> => {
    this.checkCurrencySupport(currency);

    // TODO: support for more currencies
    assert(currency === 'BTC');

    const { invoice, rHash } = await this.xudClient.addInvoice(amount, memo);
    await this.userRepo.addInvoice({
      user,
      currency,
      rHash: String(rHash),
    });

    return invoice;
  }

  // TODO: who pays the routing fees? Not included in the value of the invoice
  public sendPayment = async (user: string, invoice: string): Promise<string> => {
    const currency = this.detectCurrency(invoice);

    const { balance } = await this.userRepo.getBalance(user, currency) as db.BalanceInstance;
    const { value } = await this.xudClient.decodeInvoice(invoice);

    if (value > balance) {
      throw errors.INSUFFICIENT_BALANCE;
    }

    await this.userRepo.updateUserBalance(user, currency, value * -1);

    const invoiceResponse = await this.xudClient.payInvoice(invoice);

    if (invoiceResponse.error !== '') {
      // Add the value of the invoice to the balance of the user because the payment failed
      await this.userRepo.updateUserBalance(user, currency, value);
    }

    return invoiceResponse.error;
  }

  // TODO: show the memo to the user? "Transactions" tab?
  private subscribeInvoices = async () => {
    await this.xudClient.subscribeInvoices();
    this.xudClient.on('invoice.settled', async (data) => {
      const { rHash, value } = data;
      const dbResult = await this.userRepo.getInvoice(rHash);

      // Make sure that the invoice is in the database which means that is was created by walli-server
      if (isObject(dbResult)) {
        this.logger.info(`Invoice update: ${JSON.stringify(data, null, 2)}`);

        await this.userRepo.deleteInvoice(rHash);

        const { user, currency } = dbResult as db.InvoiceInstance;
        await this.userRepo.updateUserBalance(user, currency, value);
      }
    });
  }

  public getBalance = async (user: string, currency: string): Promise<number> => {
    this.checkCurrencySupport(currency);

    // TODO: support for more currencies
    assert(currency === 'BTC');

    const result = await this.userRepo.getBalance(user, currency);

    if (isObject(result)) {
      const { balance } = result as db.BalanceInstance;
      return balance as number;
    }

    // There is no entry in the database for that specific user and currency
    return 0;
  }

  public getBalances = async (user: string): Promise<{ [ currency: string ]: number }> => {
    const results = await this.userRepo.getBalances(user);

    const object: { [ currency: string ]: number } = {};
    results.forEach((result) => {
      const { currency, balance } = result;
      object[currency] = balance as number;
    });

    return object;
  }

  private detectCurrency = (_invoice: string): string => {
    // TODO: detect currency of invoice
    // It is assumed that the currency is always BTC for now
    const currency = 'BTC';

    this.checkCurrencySupport(currency);

    return currency;
  }

  private checkCurrencySupport = (currency: string) => {
    if (!currency.includes(currency)) throw errors.CURRENCY_NOT_SUPPORTED;
  }
}

export default UserManager;
