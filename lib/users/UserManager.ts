import assert from 'assert';
import DB from '../db/DB';
import * as db from '../types/DB';
import UserManagerRepository from './UserManagerRepository';
import XudClient from '../xudclient/XudClient';
import errors from './Errors';
import Logger from '../Logger';
import { SubscribeInvoicesResponse } from '../proto/xudrpc_pb';

class UserManager {

  private userRepo: UserManagerRepository;

  private currencies: { [id: string]: db.CurrencyInstance } = {};

  private raidenAddress!: string;

  constructor(db: DB, private xudClient: XudClient, private logger: Logger) {
    this.userRepo = new UserManagerRepository(db);
  }

  public init = async () => {
    const currencies = await this.userRepo.getCurrencies();
    currencies.forEach((currency) => {
      this.currencies[currency.id] = currency;
    });

    const { address } = await this.xudClient.getRaidenAddress();
    this.raidenAddress = address;

    await this.subscribeInvoices();
    await this.subscribeChannelEvents();
  }

  public addUser = async (): Promise<string> => {
    const { id } = await this.userRepo.addUser();
    return id;
  }

  public addCurrency = async (currency: string, tokenAddress: string | null = null) => {
    const response = await this.userRepo.addCurrencies([{ tokenAddress, id: currency }]);
    this.currencies[response[0].id] = response[0];
  }

  public getInvoice = async (user: string, currency: string, amount: number): Promise<string> => {
    this.checkCurrencySupport(currency);

    // TODO: support for Litecoin
    assert(currency === 'BTC');

    const { invoice, rHash } = await this.xudClient.addInvoice(amount);
    this.logger.info(`Adding ${currency} invoice with rHash ${rHash}`);
    await this.userRepo.addInvoice({
      user,
      currency,
      identifier: String(rHash),
    });

    return invoice;
  }

  // TODO: who pays the routing fees? Not included in the value of the invoice
  public payInvoice = async (user: string, invoice: string) => {
    const currency = this.detectCurrencyByInvoice(invoice);

    const dbResult = await this.userRepo.getBalance(user, currency.id);
    if (dbResult !== null) {
      const { balance } = dbResult as db.BalanceInstance;
      const { value } = await this.xudClient.decodeInvoice(invoice);

      if (value > balance) {
        throw errors.INSUFFICIENT_BALANCE;
      }

      await this.userRepo.updateUserBalance(user, currency.id, value * -1);

      this.logger.info(`Paying invoice: ${invoice}`);
      const response = await this.xudClient.payInvoice(invoice);
      if (response.error !== '') {
        // Add the value of the invoice to the balance of the user because the payment failed
        await this.userRepo.updateUserBalance(user, currency.id, value);
        throw response.error;
      }
    } else {
      throw errors.INSUFFICIENT_BALANCE;
    }
  }

  public requestTokenPayment = async (user: string, currency: string): Promise<{ identifier: number, targetAddress: string }> => {
    this.checkCurrencySupport(currency);

    const { tokenAddress } = this.currencies[currency];
    if (tokenAddress !== null) {
      // Random integer from 0 to 100000000
      const identifier = Math.floor(Math.random() * 100000001);
      this.logger.info(`Adding ${currency} payment request with identifier ${identifier}`);
      await this.userRepo.addInvoice({
        user,
        currency,
        identifier: String(identifier),
      });

      return {
        identifier,
        targetAddress: this.raidenAddress,
      };

    } else {
      throw errors.NO_ERC20;
    }
  }

  public sendToken = async (user: string, currency: string, targetAddress: string, amount: number, identifier: number) => {
    this.checkCurrencySupport(currency);

    const { tokenAddress } = this.currencies[currency];
    if (tokenAddress !== null) {
      const dbResult = await this.userRepo.getBalance(user, currency);

      if (dbResult !== null) {
        const { balance } = dbResult as db.BalanceInstance;

        if (amount > balance) {
          throw errors.INSUFFICIENT_BALANCE;
        }

        await this.userRepo.updateUserBalance(user, currency, amount * -1);

        this.logger.info(`Sending ${amount} ${currency} to ${targetAddress} with identifier ${identifier}`);
        const response = await this.xudClient.sendToken(tokenAddress, targetAddress, amount, identifier);
        if (response.error !== '') {
          // Add the amount of the transfer to the balance of the user because the payment failed
          await this.userRepo.updateUserBalance(user, currency, amount);
          throw response.error;
        }
      } else {
        throw errors.INSUFFICIENT_BALANCE;
      }

    } else {
      throw errors.NO_ERC20;
    }
  }

  public getBalance = async (user: string, currency: string): Promise<number> => {
    this.checkCurrencySupport(currency);

    // TODO: support for more currencies
    assert(currency === 'BTC');

    const result = await this.userRepo.getBalance(user, currency);

    if (result !== null) {
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

  private subscribeInvoices = async () => {
    await this.xudClient.subscribeInvoices();
    this.xudClient.on('invoice.settled', async (data) => {
      const { rHash, value } = data;
      const dbResult = await this.userRepo.getInvoice(rHash);

      // Make sure that the invoice is in the database which means that it was created by walli-server
      if (dbResult !== null) {
        const { user, currency } = dbResult as db.InvoiceInstance;
        this.logIncreaseBalance(user, currency, value);

        await this.userRepo.deleteInvoice(rHash);
        await this.userRepo.updateUserBalance(user, currency, value);
      }
    });
  }

  private subscribeChannelEvents = async () => {
    await this.xudClient.subscribeChannelEvents();
    this.xudClient.on('channel.event', async (data) => {
      const { eventType, identifier, amount } = data;

      if (eventType === 'EventTransferReceivedSuccess') {
        const dbResult = await this.userRepo.getInvoice(identifier);

        // Make sure that the invoice is in the database which means that it was created by walli-server
        if (dbResult !== null) {
          // TODO: verfiy token sent is specified currency
          const { user, currency } = dbResult as db.InvoiceInstance;
          this.logIncreaseBalance(user, currency, amount);

          await this.userRepo.deleteInvoice(identifier);
          await this.userRepo.updateUserBalance(user, currency, amount);
        }
      }
    });
  }

  private logIncreaseBalance = (user: string, currency: string, amount: number) => {
    this.logger.info(`Adding ${amount} to ${currency} balance of ${user}`);
  }

  private detectCurrencyByInvoice = (_invoice: string): db.CurrencyInstance => {
    // TODO: detect currency of invoice
    // It is assumed that the currency is always BTC for now
    const currency = 'BTC';

    return this.currencies[currency];
  }

  private checkCurrencySupport = (currency: string) => {
    if (this.currencies[currency] === undefined) throw errors.CURRENCY_NOT_SUPPORTED;
  }
}

export default UserManager;
