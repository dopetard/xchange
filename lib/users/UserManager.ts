import assert from 'assert';
import DB from '../db/DB';
import * as db from '../types/DB';
import UserManagerRepository from './UserManagerRepository';
import XudClient from '../xudclient/XudClient';
import errors from './Errors';
import Logger from '../Logger';
import HistoryManager, { History } from '../history/HistoryManager';
import { getPairId } from '../Utils';

type UserManagerComponents = {
  db: DB,
  xudClient: XudClient,
  historyManager: HistoryManager,
  logger: Logger;
};

// TODO: store balances in RAM?
// TODO: support more fiat currencies than USD
class UserManager {

  private logger: Logger;
  private xudClient: XudClient;
  private historyManager: HistoryManager;

  private userRepo: UserManagerRepository;

  private currencies: Map<String, db.CurrencyInstance> = new Map<String, db.CurrencyInstance>();

  private lndPubKey!: string;
  private raidenAddress!: string;

  constructor(components: UserManagerComponents) {
    this.userRepo = new UserManagerRepository(components.db);
    this.logger = components.logger;
    this.xudClient = components.xudClient;
    this.historyManager = components.historyManager;
  }

  public init = async () => {
    const currencies = await this.userRepo.getCurrencies();
    currencies.forEach((currency) => {
      this.currencies[currency.id] = currency;
    });

    try {
      const infoResponse = await this.xudClient.getInfo();

      this.lndPubKey = infoResponse.lnd!.identityPubkey;
      this.raidenAddress = infoResponse.raiden!.address;

      await this.subscribeInvoices();
      await this.subscribeChannelEvents();
    } catch (exception) {
      XudClient.lostXudConnection(this.logger, exception);
    }
  }

  public addUser = async (): Promise<string> => {
    const { id } = await this.userRepo.addUser();
    return id;
  }

  public addCurrency = async (currency: string, tokenAddress: string | null = null) => {
    this.logger.info(`Adding currency ${currency}`);
    const response = await this.userRepo.addCurrencies([{ tokenAddress, id: currency }]);
    await this.historyManager.initHistory(currency, 'USD');
    this.currencies[response[0].id] = response[0];
  }

  public getInvoice = async (user: string, currency: string, amount: number): Promise<string> => {
    this.checkCurrencySupport(currency);
    this.checkAmountGreaterZero(amount);

    // TODO: support for Litecoin
    assert(currency === 'BTC', 'Only BTC is supported for now');

    const { invoice } = await this.xudClient.addInvoice(amount);
    this.logger.info(`Adding ${currency} invoice with identifier ${invoice}`);
    await this.userRepo.addInvoice({
      user,
      currency,
      identifier: invoice,
    });

    return invoice;
  }

  // TODO: who pays the routing fees? Not included in the value of the invoice
  public payInvoice = async (user: string, invoice: string) => {
    const currency = this.detectCurrencyByInvoice(invoice);

    const dbResult = await this.userRepo.getBalance(user, currency.id);
    if (dbResult) {
      const { balance } = dbResult as db.BalanceInstance;
      const { destination, value } = await this.xudClient.decodeInvoice(invoice);

      if (value > balance) {
        throw errors.INSUFFICIENT_BALANCE;
      }

      await this.userRepo.updateUserBalance(user, currency.id, value * -1);

      if (destination !== this.lndPubKey) {
        this.logger.info(`Paying invoice: ${invoice}`);
        const response = await this.xudClient.payInvoice(invoice);
        if (response.error !== '') {
          // Add the value of the invoice to the balance of the user because the payment failed
          await this.userRepo.updateUserBalance(user, currency.id, value);
          throw response.error;
        }
      } else {
        await this.sendingToOwnNode(invoice, currency.id, value, user);
      }
    } else {
      throw errors.INSUFFICIENT_BALANCE;
    }
  }

  public requestTokenPayment = async (user: string, currency: string): Promise<{ identifier: number, targetAddress: string }> => {
    this.checkCurrencySupport(currency);

    const { tokenAddress } = this.currencies[currency];
    if (tokenAddress) {
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
    this.checkAmountGreaterZero(amount);

    const { tokenAddress } = this.currencies[currency];
    if (tokenAddress) {
      const dbResult = await this.userRepo.getBalance(user, currency);

      if (dbResult) {
        const { balance } = dbResult as db.BalanceInstance;

        if (amount > balance) {
          throw errors.INSUFFICIENT_BALANCE;
        }

        await this.userRepo.updateUserBalance(user, currency, amount * -1);

        if (targetAddress !== this.raidenAddress) {
          this.logger.info(`Sending ${amount} ${currency} to ${targetAddress} with identifier ${identifier}`);
          const response = await this.xudClient.sendToken(tokenAddress, targetAddress, amount, identifier);
          if (response.error !== '') {
            // Add the amount of the transfer to the balance of the user because the payment failed
            await this.userRepo.updateUserBalance(user, currency, amount);
            throw response.error;
          }

        } else {
          await this.sendingToOwnNode(String(identifier), currency, amount, user);
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

    const result = await this.userRepo.getBalance(user, currency);

    if (result) {
      const { balance } = result as db.BalanceInstance;
      return balance as number;
    }

    // There is no entry in the database for that specific user and currency
    return 0;
  }

  public getBalances = async (user: string): Promise<{ [ currency: string ]: number }> => {
    const dbResults = await this.userRepo.getBalances(user);

    const result: { [ currency: string ]: number } = {};
    dbResults.forEach((dbResult) => {
      const { currency, balance } = dbResult;
      result[currency] = balance as number;
    });

    return result;
  }

  public getHistory = (currency: string): History => {
    return this.historyManager.history[getPairId(currency, 'USD')];
  }

  public getBasicHistory = (currency: string): { price: number, change: number } => {
    const { price, change } = this.historyManager.history[getPairId(currency, 'USD')];
    return {
      price,
      change,
    };
  }

  private subscribeInvoices = async () => {
    await this.xudClient.subscribeInvoices();
    this.xudClient.on('invoice.settled', async (data) => {
      const { rHash, value } = data;
      const dbResult = await this.userRepo.getInvoice(rHash);

      // Make sure that the invoice is in the database which means that it was created by walli-server
      if (dbResult) {
        const { user, currency } = dbResult as db.InvoiceInstance;
        await this.paymentSucceeded(rHash, user, currency, value);
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
        if (dbResult) {
          // TODO: verfiy token sent is the one specified
          const { user, currency } = dbResult as db.InvoiceInstance;
          await this.paymentSucceeded(identifier, user, currency, amount);
        }
      }
    });
  }

  // Everything we need to do is updating the balances
  // because the user wants to send a payment to another user on the same walli-server instance
  private sendingToOwnNode = async (identifier: string, sentCurrency: string, amount: number, sender: string) => {
    this.logger.info(`Recipient is on the same walli-server instance`);
    const dbResult = await this.userRepo.getInvoice(identifier);

    if (dbResult !== null) {
      const { user, currency } = dbResult as db.InvoiceInstance;

      if (sentCurrency === currency) {
        await this.paymentSucceeded(identifier, user, currency, amount);
        return;
      } else {
        throw errors.WRONG_CURRENCY;
      }
    } else {
      throw errors.INVOICE_NOT_FOUND;
    }

    await this.userRepo.updateUserBalance(sender, sentCurrency, amount);
  }

  private paymentSucceeded = async (identifier: string, user: string, currency: string, amount: number) => {
    this.logger.info(`Adding ${amount} to ${currency} balance of ${user}`);

    await this.userRepo.deleteInvoice(identifier);
    await this.userRepo.updateUserBalance(user, currency, amount);
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

  private checkAmountGreaterZero = (amount: number) => {
    if (!(amount > 0)) throw errors.AMOUNT_NOT_GREATER_ZERO;
  }
}

export default UserManager;
